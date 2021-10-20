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

/**
 * 登录
 * @param {*} username
 * @param {*} password
 */
Cypress.Commands.add("login", ({ username = "l1", password = "aini123456" } = {}) => {
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
            cy.get('input[placeholder="登录密码"]')
                .clear()
                .type(password + "{enter}", { sensitive: true });
            cy.getCookie("Access-Token-lhis")
                .should("exist")
                .then((c) => {
                    cy.writeFile("cypress/fixtures/token.json", { token: c.value, timestamp: now });
                });
        } else {
            cy.setCookie("Access-Token-lhis", token);
            cy.writeFile("cypress/fixtures/token.json", { token, timestamp: now });
        }
    });
});

/**
 * 触发表格中操作
 * @param {*} name 按钮名称
 * @param {*} rowIndex
 */
Cypress.Commands.add("tableAction", (name, rowIndex = 0) => {
    cy.get(
        `.vxe-table--render-default .vxe-table--body-wrapper.body--wrapper tr:nth-of-type(${
            rowIndex + 1
        }) .action-btn .action-btn`
    ).each(($el, index, $list) => {
        // $el is a wrapped jQuery element
        console.log($el, "jquery");
        let $ele = $el[0];
        let className = $ele.className;
        if (className.indexOf("ivu-dropdown") > -1) {
            cy.wrap($ele).trigger("mouseenter", { force: true });
            cy.get(".ivu-dropdown-item:visible").contains(name).click();
        } else if ($ele.innerHTML.trim() === name) {
            cy.wrap($ele).click({ force: true });
        }
    });
});

/**
 * 触发表格上面操作
 * @param {*} name 按钮名称
 * @param {*} rowIndex
 */
Cypress.Commands.add("tableActionExtra", (name) => {
    cy.get(".wrapper-content .ivu-card-extra .ivu-btn").contains(name).click();
});
