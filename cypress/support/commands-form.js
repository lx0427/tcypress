/**
 * 获取formItemWrap
 * @param {*} name 对应label完全匹配
 */
Cypress.Commands.add("formItemWrap", (name) => {
    let $dom = null;
    cy.get(".ivu-form-item-label")
        .each(($ele, index, $list) => {
            // each跳出循环
            // continue: return true
            // break: return false
            if ($list.length === 1) {
                $dom = $ele;
                return false;
            }
            let text = $ele[0].innerHTML.trim();
            if (name === text) {
                $dom = $ele;
                return false;
            }
        })
        .then(() => {
            return cy.wrap($dom).first().closest(".ivu-form-item");
        });
});

/**
 * 获取表单formItem
 * @param {*} name 对应label完全匹配
 * @param {*} value
 * @param {*} type input,number,select
 */
Cypress.Commands.add("getFormItem", (name, type = "input") => {
    let selector = "";
    switch (type) {
        case "number":
            selector = ".ivu-input-number-input";
            break;
        case "select":
            selector = ".ivu-select-input";
            break;
        case "upload":
            selector = ".ivu-icon-md-add";
            break;
        default:
            selector = ".ivu-input";
            break;
    }
    return cy.formItemWrap(name).find(selector);
});

/**
 * 设置单个表单项值
 * @param {*} name 对应label完全匹配
 * @param {*} value
 * @param {*} type input,number,select
 */
Cypress.Commands.add("setFormItem", ({ name, value, type }) => {
    if (["input", "number", "date"].includes(type)) {
        cy.getFormItem(name, type).type(value);
        if (type === "date") {
            cy.formItemWrap(name).find(".ivu-form-item-label").click();
        }
    } else if (type === "inputMap") {
        cy.getFormItem(name, type).click();
        cy.get(".ivu-list-container .ivu-list-item").first().click();
        cy.wait(1000);
        cy.modalAction("地图位置标记", "确定").click();
    } else if (type === "upload") {
        cy.formItemWrap(name).find("input[type='file']").attachFile(value);
    } else if (type === "select") {
        cy.getFormItem(name, type).click();
        if (Array.isArray(value)) {
            value.forEach((v) => {
                cy.formItemWrap(name).find(".ivu-select-item").eq(v).click({ force: true });
            });
            cy.getFormItem(name, type).click();
        } else {
            cy.formItemWrap(name).find(".ivu-select-item").eq(value).click({ force: true });
        }
    }
});

/**
 * 批量设置表单项值
 * @param {*} name 对应label完全匹配
 * @param {*} value
 * @param {*} type input,number,select
 */
Cypress.Commands.add("setFormItems", (data) => {
    data.forEach((item) => {
        cy.setFormItem(item);
    });
});

/**
 * modal
 * @param {*} modalTitle
 * @param {*} buttonName
 */
Cypress.Commands.add("modalAction", (modalTitle, buttonName) => {
    return cy
        .get(".ivu-modal-header-inner")
        .contains(modalTitle)
        .closest(".ivu-modal-content")
        .find(".ivu-modal-footer .ivu-btn")
        .contains(buttonName);
});
