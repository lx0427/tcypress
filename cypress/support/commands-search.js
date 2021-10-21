/**
 * 表单搜索项 input
 * @param {*} placeholder
 */
Cypress.Commands.add("searchInput", (placeholder, value) => {
    return cy.get(`.wrapper-query input[placeholder="${placeholder}"]`).type(value);
});

/**
 * 表单搜索项 select
 * @param {*} placeholder
 */
Cypress.Commands.add("searchSelect", (placeholder, value) => {
    cy.get(`.wrapper-query input[placeholder="${placeholder}"]`)
        .closest(".ivu-select")
        .within(() => {
            if (Array.isArray(value)) {
                value.forEach((v) => {
                    cy.get(".ivu-select-item").eq(v).click({ force: true });
                });
                cy.get(".ivu-select-input").click();
            } else {
                cy.get(".ivu-select-item").eq(value).click({ force: true });
            }
        });
});

/**
 * 设置多个表单搜索项
 * @param {*} placeholder
 */
Cypress.Commands.add("setSearchForm", (data) => {});
