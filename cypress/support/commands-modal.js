Cypress.Commands.add("modalWrap", (modalTitle) => {
    return cy.get(".ivu-modal-header-inner:visible").contains(modalTitle).closest(".ivu-modal-content");
});
Cypress.Commands.add("modalAction", (modalTitle, buttonName) => {
    return cy.modalWrap(modalTitle).find(".ivu-modal-footer .ivu-btn").contains(buttonName);
});
Cypress.Commands.add("modalClose", (modalTitle) => {
    return cy.modalWrap(modalTitle).find(".ivu-modal-close").click();
});

/**
 * 二次确认
 */
Cypress.Commands.add("modalConfirm", (modalTitle, buttonName) => {
    return cy
        .get(".ivu-modal-confirm-head-title:visible")
        .contains(modalTitle)
        .closest(".ivu-modal-confirm")
        .find(".ivu-modal-confirm-footer .ivu-btn")
        .contains(buttonName)
        .click();
});
