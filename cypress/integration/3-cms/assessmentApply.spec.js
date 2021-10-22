describe("assessmentApply visit", () => {
    let formAdd = [
        { name: "参保人姓名", value: "张全蛋", type: "input" },
        { name: "参保人身份证号", value: "110101199003076157", type: "input" },
    ];
    let formEdit = [];
    let formSearch = [];

    before(() => {
        cy.login();
        cy.visit("/assessmentApply");
    });

    beforeEach(() => {
        // Cypress 会在每次测试前自动清除所有 Cookie，以防止在测试用例之间共享状态
        Cypress.Cookies.preserveOnce("Access-Token-lhis");
    });
    it("begin", () => {
        cy.get(".step1").within(() => {
            cy.setFormItems(formAdd);
            cy.get(".ivu-btn").contains("开始申请").click();
        });
    });
});
