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
 * @param {*} type number,select,upload,input,date,inputMap
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
 * @param {*} type inputMap,select,upload,input,number,date
 */
Cypress.Commands.add("setFormItem", ({ name, value, type, load, clear = false }) => {
    clear && cy.clearFormItem({ name, value, type });

    switch (type) {
        case "inputMap":
            cy.getFormItem(name, type).click();
            cy.get(".ivu-list-container .ivu-list-item").first().click();
            load && cy.wait(load); // 加载地图
            cy.modalAction("地图位置标记", "确定").click();
            break;
        case "upload":
            cy.formItemWrap(name).find("input[type='file']").attachFile(value);
            load && cy.wait(load); // 上传文件
            break;
        case "select":
            cy.getFormItem(name, type).click();
            load && cy.wait(load); // 请求数据
            if (Array.isArray(value)) {
                value.forEach((v) => {
                    cy.formItemWrap(name).find(".ivu-select-item").eq(v).click({ force: true });
                });
                cy.getFormItem(name, type).click();
            } else {
                cy.formItemWrap(name).find(".ivu-select-item").eq(value).click({ force: true });
            }
            break;
        default:
            cy.getFormItem(name, type).type(value);
            if (type === "date") {
                cy.formItemWrap(name).find(".ivu-form-item-label").click();
            }
            break;
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
 * 清空formItem
 * @param {*} name 对应label完全匹配
 * @param {*} value (! 多选数组清空必须传入数组)
 * @param {*} type input,number,select
 */
Cypress.Commands.add("clearFormItem", ({ name, value, type }) => {
    if (type === "select") {
        if (Array.isArray(value)) {
            cy.formItemWrap(name).find(".ivu-icon.ivu-icon-ios-close").click({ multiple: true, force: true });
        } else {
            cy.formItemWrap(name).click();
            cy.formItemWrap(name).find(".ivu-icon-ios-close-circle").click();
        }
    } else {
        cy.getFormItem(name, type).clear();
    }
});
