Cypress.Commands.add("row", (index = 0) => {
    return cy.get(`.vxe-table--render-default .vxe-table--body-wrapper.body--wrapper tr:nth-of-type(${index + 1})`);
});

/**
 * 触发表格中操作
 * @param {*} name 按钮名称
 * @param {*} rowIndex
 */
Cypress.Commands.add("tableAction", (name, rowIndex = 0) => {
    cy.get(
        `.vxe-table--render-default .vxe-table--body-wrapper.body--wrapper tr:nth-of-type(${
            rowIndex + 1
        }) .action-btn .action-btn`
    ).each(($el, index, $list) => {
        // $el is a wrapped jQuery element
        console.log($el, "jquery");
        let $ele = $el[0];
        let className = $ele.className;
        if (className.indexOf("ivu-dropdown") > -1) {
            cy.wrap($ele).trigger("mouseenter", { force: true });
            cy.get(".ivu-dropdown-item:visible").contains(name).click();
            return false;
        } else if ($ele.innerHTML.trim() === name) {
            cy.wrap($ele).click({ force: true });
            return false;
        }
    });
});

/**
 * 触发表格上面操作
 * @param {*} name 按钮名称
 * @param {*} rowIndex
 */
Cypress.Commands.add("tableActionExtra", (name) => {
    return cy.get(".wrapper-content .ivu-card-extra .ivu-btn").contains(name).click();
});
