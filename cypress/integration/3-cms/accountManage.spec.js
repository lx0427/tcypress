import { genName } from "../../support/utils";
describe("careOrg visit", () => {
    before(() => {
        cy.login();
        cy.visit("/accountManage");
    });

    beforeEach(() => {
        // Cypress 会在每次测试前自动清除所有 Cookie，以防止在测试用例之间共享状态
        Cypress.Cookies.preserveOnce("Access-Token-lhis");
    });

    describe("body snapshot", () => {
        it.only("body snapshot", () => {
            cy.wait(1000);
            cy.get("body").snapshot();
        });
    });
});
