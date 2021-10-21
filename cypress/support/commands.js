// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// 全局不清理指定cookie
// Cypress.Cookies.defaults({
//     preserve: ["Access-Token-lhis"],
// });

Cypress.Commands.overwrite("type", (originalFn, element, text, options) => {
    if (options && options.sensitive) {
        options.log = false;
        // 创建自定义命令的日志
        Cypress.log({
            $el: element,
            name: "type",
            message: "*".repeat(text.length),
        });
    }

    return originalFn(element, text, options);
});

/**
 * 登录
 * @param {*} username
 * @param {*} password
 */
Cypress.Commands.add("login", ({ username = Cypress.env("username"), password = Cypress.env("password") } = {}) => {
    cy.fixture("token.json").then((data) => {
        let { token, timestamp = 0 } = data;
        let now = new Date().getTime();
        if (!token || now >= timestamp + 86400000) {
            cy.visit("/login");
            // 拦截图形验证码接口
            cy.intercept("GET", "**/kaptchaCode*").as("kaptchaCode");
            cy.get(".code-img").click();
            // 获取接口返回信息
            cy.wait("@kaptchaCode").then((res) => {
                let rep = JSON.parse(res.response.body);
                cy.get('input[placeholder="验证码"]').clear().type(rep.data.kaptchaCode);
            });
            cy.get('input[placeholder="用户名"]').clear().type(username);
            // 拦截登录
            cy.intercept("POST", "**/login/login*").as("login");
            cy.get('input[placeholder="登录密码"]')
                .clear()
                .type(password + "{enter}", { log: false });
            // .type(password + "{enter}", { sensitive: true });
            cy.wait("@login").then((res) => {
                let data = JSON.parse(res.response.body);
                cy.writeFile("cypress/fixtures/token.json", { token: data.data.uid, timestamp: now });
            });
        } else {
            cy.setCookie("Access-Token-lhis", token);
            cy.writeFile("cypress/fixtures/token.json", { token, timestamp: now });
        }
    });
});
