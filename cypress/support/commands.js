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
Cypress.Commands.add("login", (username = "lixiong", password = "aini123456") => {
    cy.visit("/login");
    cy.intercept("GET", "**/kaptchaCode*").as("kaptchaCode");
    cy.get(".code-img").click();
    cy.wait("@kaptchaCode").then((res) => {
        let rep = JSON.parse(res.response.body);
        cy.get('input[placeholder="验证码"]').clear().type(rep.data.kaptchaCode);
    });
    cy.get('input[placeholder="用户名"]').clear().type(username);
    cy.get('input[placeholder="登录密码"]').clear().type(password);
    // http://lhisdev.thalys.net.cn/api/user/os/login/login?c=100&y=Sys&sign=sign&t=1634542732001&q=%7B%7D
    cy.contains("登录").click();
});
