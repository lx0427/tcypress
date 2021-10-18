describe("careOrg visit", () => {
    before(() => {
        // cy.login();
        cy.setCookie("Access-Token-lhis", "6563d53307a74b17b2e3f736c2dc92f0");
    });
    it("careOrg edit", () => {
        cy.visit("/careOrg");
        cy.tableAction("更新记录", 1);
    });
});
