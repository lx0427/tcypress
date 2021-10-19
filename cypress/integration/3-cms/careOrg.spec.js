import { genName } from "../../support/utils";
describe("careOrg visit", () => {
    before(() => {
        cy.login();
        cy.visit("/careOrg");
    });

    it.only("careOrg search", () => {
        cy.url().should("include", "/careOrg");
        //  cy.get(".wrapper-query .ivu-card-extra .ivu-btn").should("have.length", 2);
    });

    it("careOrg add", () => {
        cy.tableActionExtra("新增");
        cy.wait(1000);
        let data = [
            { name: "机构名称", value: genName(), type: "input" },
            { name: "类型", value: 1, type: "select" },
            { name: "机构性质", value: 0, type: "select" },
            { name: "统一社会信用代码或注册号", value: "11111111111111111111111111", type: "input" },
            { name: "法定代表人", value: "123", type: "input" },
            { name: "法定代表人电话", value: "13333333333", type: "input" },
            { name: "负责人", value: "123", type: "input" },
            { name: "负责人电话", value: "13333333333", type: "input" },
            { name: "机构护理方式", value: [0, 1], type: "select" },
            { name: "医疗机构类型", value: 1, type: "select" },
            { name: "计划长护险床位数", value: 12, type: "number" },
            { name: "护理人员数量", value: 12, type: "number" },
            { name: "医疗资质有效期", value: "2021-10-01 - 2021-11-31", type: "date" },
            { name: "有效开始日期", value: "2021-10-01", type: "date" },
            { name: "所属区县", value: 0, type: "select" },
            { name: "所属街道", value: 0, type: "select" },
            { name: "详细地址", value: "123", type: "input" },
            { name: "地址坐标", value: "", type: "inputMap" },
            { name: "机构封面图片", value: "01.png", type: "upload" },
            { name: "资质证明材料（最多20张）", value: "01.png", type: "upload" },
        ];
        cy.setFormItems(data);
        cy.modalAction("新增机构信息", "确定").click();
    });

    it("careOrg edit", () => {
        cy.tableAction("更新记录", 1);
    });
});
