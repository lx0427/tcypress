/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
/**
 * @type {Cypress.PluginConfig}
 */

const fs = require("fs-extra");
const path = require("path");

function resolve(filePath) {
    return path.join(__dirname, filePath);
}

/**
 * 重置系统信息
 */
function resetAppData() {
    // 每次重启清理token信息
    fs.writeFileSync(resolve(`../fixtures/token.json`), "{}");
}

/**
 * 获取环境配置
 * @param {*} env
 * @returns
 */
function getConfigByEnv(env) {
    return fs.readJSON(resolve(`../config/cypress.${env}.json`));
}

module.exports = (on, config) => {
    // `on` is used to hook into various events Cypress emits
    // `config` is the resolved Cypress config
    // 重置数据
    resetAppData();

    // 处理配置文件
    const env = config.env.appEnv || "dev";
    return getConfigByEnv(env);
};
