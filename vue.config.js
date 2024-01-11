/**
 * @description 自动转化css
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const autoprefixer = require('autoprefixer');
/**
 * @description 按需开启gzip压缩，压缩选取的文件类型
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = /\.(ts|scss|js|css|json|txt|html|ico|svg)(\?.*)?$/i;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir);
}

const externals = {
  vue: 'Vue',
  vuex: 'Vuex',
  'vue-router': 'VueRouter',
  'element-plus': 'ElementPlus',
  axios: 'axios'
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const fs = require('fs');
//
// const svgArr = [];
// fs.readdir('./public/static/icons', (err, files) => {
//   if (err) console.log(err);
//   else {
//     console.log('\nCurrent directory filenames:');
//     files.forEach((file) => {
//       console.log(file);
//       svgArr.push('./static/icons/' + String(file));
//     });
//   }
// });
/**
 * @description boolean,是否是生产环境
 */
const isProd = ['prod', 'production'].includes(process.env.NODE_ENV);

const name = 'IA-BET';

const port = 8099;

/**
 * @description 打包删除log
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  lintOnSave: true,
  /**
   * @description 生成文件的目录名称（要和baseUrl的生产环境路径一致）
   */
  outputDir: 'c-pc-static',
  /**
   * @description 根目录
   */
  publicPath: './',
  /**
   * @description 去除生产环境.map文件
   */
  productionSourceMap: false,
  configureWebpack: (config) => {
    const configNew = {
      name: name, // 设置 html 标题名
      resolve: {
        // 设置 alias
        alias: {
          '@': resolve('src')
        }
      }
    };
    if (isProd) {
      config.optimization.runtimeChunk = 'single';

      config.optimization.splitChunks = {
        chunks: 'all',

        maxInitialRequests: Infinity,

        minSize: 20000,

        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,

            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js

              // or node_modules/packageName

              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

              // npm package names are URL-safe, but some servers don't like @ symbols

              return `npm.${packageName.replace('@', '')}`;
            }
          }
        }
      };

      configNew.plugins = [
        // gzip
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          test: productionGzipExtensions,
          threshold: 2024,
          minRatio: 0.8,
          deleteOriginalAssets: false
        })
        // new webpack.DefinePlugin({
        //   __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false)
        // })
      ];
      config.optimization.minimizer.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            output: {
              beautify: false,
              comments: false
            },
            compress: {
              // warnings: false,
              drop_debugger: true, // 清除debugger語句
              drop_console: true,
              pure_funcs: ['console.log'] // 清除console
            },
            sourceMap: false
          }
        })
      );
    }
    return configNew;
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [autoprefixer()]
      }
    }
  },
  chainWebpack(config) {
    config.plugins.delete('prefetch');
    config.externals = externals;

    // const targetHtmlPluginNames = ['html'];
    // targetHtmlPluginNames.forEach((name) => {
    //   config.plugin(name).tap((options) => {
    //     options[0].svgArr = svgArr;
    //     return options;
    //   });
    // });

    /**
     * @description 配置svga
     */
    const svgaRule = config.module.rule('svga');
    svgaRule
      .test(/\.(svga)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({ limit: 1024 })
      .end();

    /**
     * @description 设置 svg-sprite-loader
     */
    config.module.rule('svg').exclude.add(resolve('src/icons')).end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();

    /**
     * @description 引入全局样式文件
     */
    const oneOfsMap = config.module.rule('scss').oneOfs.store;
    oneOfsMap.forEach((item) => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({ resources: './src/themes/variable/index.scss' });
    });

    // 配置图片压缩插件
    const imagesRule = config.module.rule('image');
    imagesRule
      .test(/\.(png|jpe?g|gif)(\?.*)?$/)
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({ disable: !isProd })
      .end();
  },
  devServer: {
    port,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API,
        pathRewrite: {
          '^/api': '/'
        },
        secure: false,
        changeOrigin: true
      }
    }
  }
};
