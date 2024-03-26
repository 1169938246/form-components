/** @type { import('@storybook/react-webpack5').StorybookConfig } */
// .storybook/main.js

const path = require('path');

export default{
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        'less-loader',
      ],
      include: path.resolve(__dirname, '../src'), // 确保只处理src目录下的less文件
    });

    return config;
  },
}; 


