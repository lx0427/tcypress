import { genName } from "../../support/utils";
describe("careOrg visit", () => {
    let careName = genName();
    let formAdd = [
        { name: "机构名称", value: careName, type: "input" },
        { name: "类型", value: 1, type: "select" },
        { name: "机构性质", value: 0, type: "select" },
        { name: "统一社会信用代码或注册号", value: "11111111111111111111111111", type: "input" },
        { name: "法定代表人", value: "123", type: "input" },
        { name: "法定代表人电话", value: "13333333333", type: "input" },
        { name: "负责人", value: "123", type: "input" },
        { name: "负责人电话", value: "13333333333", type: "input" },
        { name: "医疗机构类型", value: 1, type: "select" },
        { name: "是否医疗定点机构", value: 0, type: "select" },
        { name: "机构护理方式", value: [0, 1], type: "select" },
        { name: "计划长护险床位数", value: 12, type: "number" },
        { name: "护理人员数量", value: 12, type: "number" },
        { name: "医疗资质有效期", value: "2021-10-01 - 2021-11-31", type: "date" },
        { name: "有效开始日期", value: "2021-10-01", type: "date" },
        { name: "所属区县", value: 0, type: "select" },
        { name: "所属街道", value: 0, type: "select", delay: 100 },
        { name: "详细地址", value: "123", type: "input" },
        { name: "地址坐标", value: "", type: "inputMap", delay: 800 },
        { name: "机构封面图片", value: "01.png", type: "upload" },
        { name: "资质证明材料（最多20张）", value: "01.png", type: "upload" },
    ];
    let formEdit = [{ name: "是否医疗定点机构", value: 1, type: "select" }];
    let formSearch = [
        { name: "所在区县", value: 0, type: "select" },
        { name: "护理机构类型", value: 1, type: "select" },
        { name: "护理机构名称", value: careName, type: "input" },
        { name: "机构编号", value: "", type: "input" },
        { name: "信息变更审核状态", value: 0, type: "select" },
        { name: "信息变更审核结果", value: 0, type: "select" },
        { name: "服务状态", value: 0, type: "select" },
    ];

    before(() => {
        cy.login();
        cy.visit("/careOrg");
    });

    beforeEach(() => {
        // Cypress 会在每次测试前自动清除所有 Cookie，以防止在测试用例之间共享状态
        Cypress.Cookies.preserveOnce("Access-Token-lhis");
    });

    it("add", () => {
        cy.tableActionExtra("新增");
        cy.setFormItems(formAdd);
        cy.modalAction("新增机构信息", "确定").click();
    });

    it("edit: add multiple select", () => {
        cy.tableAction("编辑");
        cy.wait(1000);
        cy.setFormItem({ name: "机构运营模式", value: [0, 1], type: "select" });
        cy.modalAction("编辑机构信息", "确定").click();
        cy.get(".tInfo_item-content").invoke("html").should("include", "医养结合,公建民营");
        cy.get('textarea[placeholder="请填写更新说明详细内容"]').type("123");
        cy.modalAction("提交更新", "确定").click();
        cy.tableAction("审核");
        cy.modalAction("审核", "通过").click();
        cy.modalConfirm("审核通过确认", "确定");
    });

    it.only("edit: clear multiple select", () => {
        cy.tableAction("编辑");
        cy.wait(1000);
        cy.clearFormItem({ name: "机构运营模式", value: [], type: "select" });
        cy.modalAction("编辑机构信息", "确定").click();
        cy.get(".tInfo_item-content").invoke("html").should("not.include", "医养结合").and("not.include", "公建民营");
        cy.get('textarea[placeholder="请填写更新说明详细内容"]').type("123");
        cy.modalAction("提交更新", "确定").click();
        cy.tableAction("审核");
        cy.modalAction("审核", "通过").click();
        cy.modalConfirm("审核通过确认", "确定");
    });

    it("edit: set isMedicalPoint", () => {
        cy.tableAction("编辑");
        cy.wait(100);
        cy.setFormItem({ name: "是否医疗定点机构", value: 0, type: "select" });
        cy.modalAction("编辑机构信息", "确定").click();
        cy.get(".tInfo_item-content").invoke("html").should("include", "否");
        cy.get('textarea[placeholder="请填写更新说明详细内容"]').type("123");
        cy.modalAction("提交更新", "确定").click();
        cy.tableAction("审核");
        cy.modalAction("审核", "通过").click();
        cy.modalConfirm("审核通过确认", "确定");
    });

    it("edit: clear isMedicalPoint", () => {
        cy.tableAction("编辑");
        cy.wait(100);
        cy.clearFormItem({ name: "是否医疗定点机构", value: "", type: "select" });
        cy.modalAction("编辑机构信息", "确定").click();
        cy.get(".tInfo_item-content").invoke("html").should("not.include", "是").and("not.include", "否");
        cy.get('textarea[placeholder="请填写更新说明详细内容"]').type("123");
        cy.modalAction("提交更新", "确定").click();
        cy.tableAction("更新记录");
        cy.get(".update-info:first .tInfo_item-content")
            .invoke("html")
            .should("not.include", "是")
            .and("not.include", "否");
        cy.modalAction("查看更新记录", "关闭").click();
        cy.tableAction("审核");
        cy.modalAction("审核", "通过").click();
        cy.modalConfirm("审核通过确认", "确定");
    });

    it.skip("careOrg search", () => {
        cy.intercept("GET", "**/user/os/organization/manager/queryList*").as("managerqueryList");
        cy.intercept("GET", "**/user/os/organization/manager/queryList*").as("managerqueryList1");
        cy.searchSelect("所在区县", 0);
        cy.searchInput("护理机构名称", "2021-10-19--421{enter}");
        cy.row().invoke("html").should("include", "2021-10-19--421");
        cy.wait(["@managerqueryList", "@managerqueryList1"]).then((res) => {
            console.log(res);
        });
    });
    it.skip("careOrg update record", () => {
        cy.contains("查看更多").click();
        cy.get(".update-count").contains("13").scrollIntoView({ duration: 2000 });
        cy.get(".ivu-modal-body").contains("审核人").closest(".ivu-modal-body").scrollTo("bottom", { duration: 2000 });
        cy.get(".ivu-modal-body").contains("审核人").closest(".ivu-modal-body").scrollTo(0, "50%", { duration: 2000 });
        cy.get(".ivu-modal-body").contains("审核人").closest(".ivu-modal-body").scrollTo(0, 200, { duration: 2000 }); // 纯数字等价于px
    });
});
