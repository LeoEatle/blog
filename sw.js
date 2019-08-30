/**
 * 自动引入模板，在原有 sw-precache 插件默认模板基础上做的二次开发
 *
 * 因为是自定导入的模板，项目一旦生成，不支持随 sw-precache 的版本自动升级。
 * 可以到 Lavas 官网下载 basic 模板内获取最新模板进行替换
 *
 */

/* eslint-disable */

'use strict';

var precacheConfig = [["/2015/01/29/hello-2015/post-bg-2015.jpg","60c0fdc97779a352360a2a87189811ae"],["/2015/04/14/unix-linux-note/post-bg-unix-linux.jpg","c48aa178cea20c0b766dfe0790803337"],["/2015/05/25/js-module-loader/post-bg-js-module.jpg","c813533f88f10e75e7725607a10f9426"],["/2015/09/22/js-version/javascript-java.jpg","27cf6dba01010760a885db49c37c16a8"],["/2015/09/22/js-version/keep-calm-and-learn-javascript.png","a5c44173a8d6669ab43cf85fe5252da0"],["/2015/09/22/js-version/post-bg-js-version.jpg","2870973c65864ce20973340d672f842f"],["/2016/07/28/Hello-Hexo/bangong.jpg","9eace6cb6c3782ccf47ab6fe6723bb74"],["/2016/07/28/Hello-Hexo/dalou.jpg","267e8de9a0fc8e3380744b713609ef79"],["/2016/07/28/Hello-Hexo/index.html","c04b43d5f6ec02fbb31343a74a4bb150"],["/2016/07/28/Hello-Hexo/kaifa.jpg","c1573aab8b7c4799e9acd1c85b0dbe74"],["/2016/07/28/Hello-Hexo/louti.jpg","af907eb5f1cb685ad50ab22de0c11a39"],["/2016/07/28/Hello-Hexo/nan.png","c54b6983be4a749aeaf74b4bc6c62627"],["/2016/07/28/Hello-Hexo/post-bg-2015.jpg","60c0fdc97779a352360a2a87189811ae"],["/2016/07/28/Hello-Hexo/shitang.jpg","4aa6d984830082bb7c350ab5f72b3543"],["/2016/07/28/Hello-Hexo/yejing.jpg","08ab3f859291db09e57fc5837d6248c1"],["/2016/07/28/Hello-Hexo/zonbu.jpg","84c1bc40902054ba7f5721cee27cf214"],["/2016/08/08/A-intresting-js/1.png","291f5b7b6470e8b7dabd0dd137cd564e"],["/2016/08/08/A-intresting-js/index.html","db3ddcb39250b392ba27a85422500231"],["/2016/09/02/The-inherit-in-javascript/index.html","0f0ffc1f4b667906c32395bb1db59559"],["/2016/09/20/令人伤心的博客碎片/index.html","f7aec8d20f9ae41956bf04cc55933e92"],["/2016/11/11/LeetCode-121-Best-time-to-Buy-and-Sell-Stock/index.html","e350bf9fdc2a717da392bb71b34422fd"],["/2016/11/13/LeetCode-112-Path-Sum/index.html","e81109b6db28f6498e79a87e86676d4a"],["/2016/11/13/Leetcode-70-Climbing-Stairs/index.html","4ce2dc4da694718a68f2396a5ff21e02"],["/2016/11/14/LeetCode-413-Arithmetic-Slices/index.html","63eff8aab4777c5e2d8ecc0360d6a7e6"],["/2016/11/14/爬虫的意义在哪里？/index.html","ea9b5d98dc7dea5fdeb9fb1e8bc68c28"],["/2016/11/15/LeetCode-202-Happy-Number/index.html","3350aaf5c423b9bf786ef7ceee1230df"],["/2016/11/20/LeetCode-453-Minimum-Moves-to-Equal-Array-Elements/index.html","9490fd7bdca88872a1798ea6c8f426e7"],["/2016/11/21/LeetCode-438-Find-All-Anagrams-in-a-String/index.html","c5260958f312d5f9b0f604ae89e2d069"],["/2016/11/22/LeetCode-448-Find-All-Numbers-Disappeared-in-an-Array/index.html","a456b68768cf6a1b75fab75a8a778e2e"],["/2016/11/23/LeetCode-455-Assign-Cookies/index.html","0bc9d47f7ab6811343ca82c93e04149c"],["/2016/11/26/LeetCode-130-Surrounded-Regions/index.html","b65e5cd2054a085f788fb57234820ca4"],["/2016/11/28/Docker学习笔记/2016-11-28 at 下午4.11.png","02f7488e4d747da509e7e1be9d4dcf7a"],["/2016/11/28/Docker学习笔记/container-layers.jpg","97c622c247ef510b06fee1aff4ec890f"],["/2016/11/28/Docker学习笔记/image-layers.jpg","adaabb4ae931eba8837211749d674dd3"],["/2016/11/28/Docker学习笔记/index.html","f2674c2593ca786c20de6fa4a5e176d6"],["/2016/11/28/LeetCode-190-Reversed-Bits/index.html","519a387b90f0d5797219cb58b5920155"],["/2016/11/28/SegmentFault开发文档笔记/index.html","a1f68852e9ae122ff840775cfd58466e"],["/2016/11/29/LeetCode-123-Best-Time-to-Buy-and-Sell-Stock-3/index.html","a8bb7fb8ccacd7612466def8100f3463"],["/2016/11/29/Twig模板引擎学习笔记/index.html","0cd01808dab6d8eb1475805b50b7d7aa"],["/2016/11/30/Angular2-Typescript入门笔记/index.html","47d190d18caf998e4edf319c60880fce"],["/2016/11/30/compositionstart事件/index.html","9a816b15e040aaa2494ab9cc3bb5410a"],["/2016/12/06/记录一次有趣的coffee-script插件魔改/index.html","60ff0aab2a5684ffd8b8127ffbfe5921"],["/2016/12/06/记录一次有趣的coffee-script插件魔改/需求.png","bb1d6b7833c3adaa2b65a9b1a0da2bf5"],["/2016/12/07/Javascript各种模块引入机制比较/index.html","f4d5ed6b8fdbe82c485389c454c1fd7f"],["/2016/12/07/LeetCode-415-Add-Strings/index.html","629a8b7a9377b7f2fdbde97588f2c827"],["/2016/12/08/Javascript设计模式与开发实践-笔记/index.html","1bf8951486f627dbf2f58e22713420d2"],["/2016/12/08/SegmentFault-gulp配置笔记/index.html","be7ffa364505033163beb09e1b978efc"],["/2016/12/10/SFDC笔记/index.html","c9aa0fcf08a0114b9ab49360c090417c"],["/2016/12/13/LeetCode-396-Rotate-Function/index.html","adb6e6e0883835a879b064f6b82de1c7"],["/2016/12/13/深入浅出node-js-笔记/index.html","6f2ce5eac7e9750fd72f1cc5e4ac9a18"],["/2016/12/17/LeetCode-274-H-index/index.html","95b5fe475fe83cd65e6bc157ac08a3c4"],["/2016/12/19/SegmentFault打工日记-魔改tagpopup组件纪录/index.html","8b882ad477be676bc0f31367b4c58251"],["/2016/12/23/LeetCode-467-Unique-Substrings-in-Wraparound-String/index.html","d080a00ca2e12e7729b27d4776820c19"],["/2016/12/25/LeetCode-129-Sum-Root-to-Leaf-Numbers/index.html","5558e147f78fa415bf6a1ef0e0cdfe8e"],["/2016/12/25/iOS-iOS-Apprentice-note/UIkit.png","e7407e9f8a33eaa1ff0ffff5c0a47f4e"],["/2016/12/25/iOS-iOS-Apprentice-note/connection.png","2d667856aac63dfadc1977e513ad6d72"],["/2016/12/25/iOS-iOS-Apprentice-note/index.html","3bcfaee6665f240e7668628d77c559a3"],["/2016/12/26/LeetCode-23-Merge-k-Sorted-Lists/index.html","fb920739ab90f2519ae560b5ee09c9d5"],["/2016/12/26/iOS-Stanford-Developing-iOS7/index.html","0a187a3fc2a9117ce80e3ce83e116702"],["/2016/12/27/SegmentFault打工日记-Video-js和直播平台/index.html","88afde3ce233e53d4e07afcd5738d16f"],["/2016/12/27/iOS-Stanford-Developing-iOS-Open-Class/index.html","cfbe9b179c09137614a4ef04e7c43c2c"],["/2016/12/31/LeetCode-116-Populating-Next-Right-Pointers-in-Each-Node/index.html","1c95111abce7ea19d3fe0daeb8a2a32b"],["/2017/01/02/LeetCode-367-Valid-Perfect-Square/index.html","621e7ee8f3242c1f801deb75c74a71fc"],["/2017/01/02/LeetCode-74-Search-a-2D-matrix/index.html","c141705d430f366891e43cb9b67ba4cf"],["/2017/01/03/LeetCode-125-Valid-Palindrome/index.html","9ec5e0a1b380ee197768198bf6a9835c"],["/2017/01/03/Swift-官方Swift-Tour学习笔记/index.html","09bdb1ce52f7233b53149e6454b1c3bb"],["/2017/01/04/LeetCode-103-Binary-Tree-Zigzag-Level-Order-Traversal/index.html","881f6c0c164dfc3db9dfbf21694b1b84"],["/2017/01/09/LeetCode-397-Integer-Replacement/index.html","0c2bfc52ee7b18b7bcbbaffaec0b2b2d"],["/2017/01/10/LeetCode-419-Battleships-in-a-Board/index.html","8ff14e20d07ce4099d9852caf4aa2cc1"],["/2017/01/10/Ng-Angular1-x复习笔记/index.html","e8e183e9c341e9dd3794d3a8b3d70964"],["/2017/01/11/LeetCode-406-Queue-Reconstruction-by-Height/index.html","c8e6d7c0d36668e6fa0c7018ca3db242"],["/2017/01/13/LeetCode-357-Count-Numbers-with-Unique-Digits/index.html","9e2647f8dc0c7fb74333e11f4b7e29d5"],["/2017/01/13/iOS-Start-Developing-iOS-Apps-Apple-Doc/index.html","3a439c16012b725e245fbf97dcfae8bb"],["/2017/01/18/iOS-官网-iOS-Apps-Developing-2/index.html","f16e318cd549ca8cf66538cf1606c761"],["/2017/01/22/Javascript忍者秘籍-读后感/index.html","68dbe592b6536120a7eaaed79652c59e"],["/2017/01/25/iOS-官网的iOS-Guide-in-Swift-3/index.html","76c52b481e402b46b9506b50cbcb0804"],["/2017/01/25/iOS-官网的iOS-Guide-in-Swift-3/lifecircle.png","8dbd58d7b830402462d9708acbbfd01d"],["/2017/02/14/iOS-官网的iOS-Guide-in-Swift-4/index.html","f7691f178ae947eba93f9c732c5fceb6"],["/2017/02/15/iOS-官网的iOS-Guide-in-Swift-5/index.html","e4cde2731a0742b010130517f1e3d697"],["/2017/02/17/iOS-官网的iOS-Guide-in-Swift-6/index.html","5090a781244ded531832d9b80c38e55d"],["/2017/02/17/鹅厂打工日记——Redux文档学习-1/index.html","9209a7429c24c657c977b2d537a76de0"],["/2017/02/28/《The-JS-you-Dont-know》读书笔记/index.html","b55932ab27302f8b8de879cc1f70f513"],["/2017/03/02/鹅厂打工日记——Jest-强大的React测试工具/index.html","82ec3c76dd14b9766ef86ea1d6326758"],["/2017/03/03/Google-Android-System-learning/index.html","c582edb8f3483680219fb600f467eec7"],["/2017/03/04/iOS-官网的iOS-Guide-in-Swift-7/index.html","129f0be7f59f0940646a7c359cff3f46"],["/2017/03/10/为什么WebAssembly能给javascript提速？/index.html","f8e13e404454b609d010cde8ea5a8ed9"],["/2017/03/10/为什么WebAssembly能给javascript提速？/langs.png","f5f05c390e7205b40b3dd18286926b9f"],["/2017/03/10/为什么WebAssembly能给javascript提速？/toolchain.png","a1fd026158f74b82a81e43ce298ece17"],["/2017/03/14/鹅厂打工日记-React-loading组件设计/index.html","e88a21ad75511e7bebb4e557a4179040"],["/2017/03/27/一个小坑-如何更改base64编码的svg图片颜色？/index.html","5d48b6c42764bccd0126e8210993f921"],["/2017/03/30/鹅厂打工日记-Mocha/index.html","432be42c6b60b7263fea56a210536f19"],["/2017/03/31/鹅厂打工日记-Karma的使用和与Mocha的配合/index.html","00423378b1e3d1b4c6571c4c881cc126"],["/2017/04/14/鹅厂打工日记-Webpack原理/index.html","26a5f5a4139204a1b3e96008c744d077"],["/2017/06/01/pwn-Windows逆向神器-OD-IDA/index.html","a4a88860ef5d21e9e877f2c99438a543"],["/2017/06/16/【鹅厂打工日记】iOS的UIWebView和Javascript的交互/index.html","d39e17161001bbc01962119796abc2e8"],["/2017/06/21/CSS的新属性：clip-path和mask/clip-path.gif","159f17e0931cc07a3b1d3e91e73c0687"],["/2017/06/21/CSS的新属性：clip-path和mask/firefox-mask-vs-clip.gif","93d99f9bb711759fcdb821fc92aeb4cb"],["/2017/06/21/CSS的新属性：clip-path和mask/firefox-mask-vs-clip2.gif","93d99f9bb711759fcdb821fc92aeb4cb"],["/2017/06/21/CSS的新属性：clip-path和mask/font.png","3668a198be8d7bcb9de9e7561f3a1229"],["/2017/06/21/CSS的新属性：clip-path和mask/img_in_text.png","9e75d6a59cef73b29a9f70e613346c39"],["/2017/06/21/CSS的新属性：clip-path和mask/index.html","b9c834d09d4aa41f65f51789e9a42ce5"],["/2017/06/21/CSS的新属性：clip-path和mask/move_mouse.gif","d60b8bddb40969b83a59abe8b63b67c6"],["/2017/06/22/Hybird的关键：WebView相关-1/index.html","7b641cd4a7a6c805ad616cde2c7fa115"],["/2017/09/08/编写Webpack插件笔记/index.html","6a9db1b207a5f1d783d7086ac6ace582"],["/2017/11/30/Mobx学习笔记/index.html","642d5f12fde56ecfe507112a1f1ee02a"],["/2017/11/30/Test-travis-ci/index.html","d751bfa5b7263e0348bc033064910047"],["/2017/12/01/Use-flow-type-in-React-project/index.html","2b8285ca444538ece2658c11198239c6"],["/2017/12/06/modify-ssh-config-to-login-with-different-rsa-key/index.html","a2820c58d696c5e2ad1f3424d515ec2d"],["/2018/06/26/flex-end-make-scrollbar-disappear/index.html","2f2860bb0c8c6a83be986f40c3b10821"],["/2018/06/26/redux-state-change-but-react-not-render/index.html","5843c7b99d5edafe891437dda040103b"],["/2018/07/02/阅读代码和英文文章小技巧/index.html","be41325ce420cbfce6e7994667ab3a59"],["/2018/07/12/UI库的目录设计和babel-plugin-import/index.html","7187facef988ebd7a3e287bde8c8e355"],["/2018/07/31/SDT自我决定理论/index.html","052df49d1b10cf1c1094eb2a05a4c01a"],["/2018/08/04/React16源码解析-As-required-order/index.html","1ead12ad64149963d5e3b9423b13b201"],["/2018/08/05/React16源码解析（Fiber）/index.html","5cc593f998b534f439b60f55532d67f7"],["/2018/08/05/React16源码解析（ReactDOM）/index.html","8430da43921a7377edb1d21391014ccc"],["/2018/08/27/释放webpack的真正潜力/index.html","c74b759a888333076725bd75aeac6c1f"],["/2018/08/27/释放webpack的真正潜力/vscode-demo.png","4414ef03ced847b4673f625517a1c692"],["/2018/08/30/iOS-webview-scrolling-issue/index.html","5033983fd2bf511f169b9cef4f81e122"],["/2018/09/17/升级到Babel-7的经验/index.html","beb8376955d68912ef2367dad3bc7ea1"],["/2018/10/16/React-tip组件的设计/index.html","021b4da56c720a596ac05c316532953a"],["/2018/11/17/【译】Facebook如何通过工具学习自动修复Bug ？/index.html","410892be1957e735d7cab2f6a56e8312"],["/2018/12/08/jenkins问题定位/index.html","83d9605d282a8e0eb658642a92432dc2"],["/2018/12/21/React-SSR实践-压测/index.html","8078eab1afb4d8a75ccfd7aa94e894e4"],["/2019/01/11/如何使用iOS的捷径生成PWA图标和web-app-manifest/index.html","eaece0513133e95ded455cb698e75f95"],["/2019/01/21/item2-profile-config/index.html","ecc565ca22e855a31ee56bd4ec3fa10e"],["/2019/01/22/i18n-about-Access-Language/index.html","b65dfe095463092d89b3a1d141d8cc85"],["/2019/02/27/Node-C-addon-学习笔记/index.html","f896a38a03784e691566ffab99545676"],["/2019/05/16/Modern-Crusaders/index.html","df46405c8685dc3f2f34b0980851df0b"],["/2019/05/22/使用docker构建老旧的前端项目/index.html","b297d31cb9c68e10193a5ca7d2796726"],["/2019/08/28/关于docker使用的一些记录/index.html","cdcafd82f1897c517a9e74a47f1ffd4e"],["/404.html","7cf4cf7cda0b21bf53abb0693daa84eb"],["/about/index.html","6e2ad80fb814096fd235e7bd673fec1d"],["/archive/index.html","1081815e66a1fe572fc61afde0587afd"],["/archives/2016/07/index.html","ca7fb35c13f38096421f0d7246d6183b"],["/archives/2016/08/index.html","417419a07c9ba7096bac834d9f48b032"],["/archives/2016/09/index.html","1b58fcccb2ecea042c63a794ad66d84a"],["/archives/2016/11/index.html","50bcce98e237000a99953404739023fb"],["/archives/2016/11/page/2/index.html","84b751b726e12aafc9ab04b6cf066130"],["/archives/2016/12/index.html","94b7b59629b263d945c35c3d1df154ff"],["/archives/2016/12/page/2/index.html","14f6ad837ad5025300f8e5a48daebd95"],["/archives/2016/index.html","e44b5341cfa326c296174d0354ce8de0"],["/archives/2016/page/2/index.html","134275ada8888f48001b067c8931f949"],["/archives/2016/page/3/index.html","7b040fe01e1877d4d2f2d6901a12d35a"],["/archives/2016/page/4/index.html","6755db2914648954bc6a5eac67d21518"],["/archives/2017/01/index.html","1cce751d72977195cf5728fc16139533"],["/archives/2017/01/page/2/index.html","8ef3f9b05286e57923fa5fd4fed07caa"],["/archives/2017/02/index.html","e22f9caa0b51e3717b91823484099850"],["/archives/2017/03/index.html","34749c7844a5a3fb3cc5f09db48b0dc8"],["/archives/2017/04/index.html","e1b9a6f1687e2b533baeaf52b2073a41"],["/archives/2017/06/index.html","b034a7583c9ff65896df03c57f99f6ee"],["/archives/2017/09/index.html","ff5b4c05d474548775989d150bd539bd"],["/archives/2017/11/index.html","5e05e2b187d4afa7978cd2c0a4bdda86"],["/archives/2017/12/index.html","54d3097e186a084bcc03eb29dc515cc4"],["/archives/2017/index.html","7b878f372bca2826f3e2e3783f0fd475"],["/archives/2017/page/2/index.html","32e5ccade6c33418792b26f677bcaa03"],["/archives/2017/page/3/index.html","c76b9a43615d8c36353e4a8d18d965cc"],["/archives/2017/page/4/index.html","58a77c7e38b71ec6c280f7ed0b909a7f"],["/archives/2018/06/index.html","3bda1009901647bf83c6a61aaf0afbf9"],["/archives/2018/07/index.html","fe9564c5b1ffe7baa2f84674cc58cb02"],["/archives/2018/08/index.html","6980a3b7519f372c19f3649c4dd409d8"],["/archives/2018/09/index.html","7b0cc7a85f98c15f9a9e0aac20a83f13"],["/archives/2018/10/index.html","68b1e47f3f76b2d3a075e706f6e87163"],["/archives/2018/11/index.html","812de7edc27515ac38b2278a41f57fc4"],["/archives/2018/12/index.html","d6bef9af4430efd38243ca5404a83c84"],["/archives/2018/index.html","d9e99304e243e80241560da964d5628a"],["/archives/2018/page/2/index.html","41966a4e4703be5d14105c6ffbd0bea3"],["/archives/2019/01/index.html","641bea13d0e0cf0044cb66d0ca469377"],["/archives/2019/02/index.html","b5b580b744d6cbfa9c120f8b36777d65"],["/archives/2019/05/index.html","6965a8f471a8b0ca200af42dceb5ced2"],["/archives/2019/08/index.html","e3b84044bd3997b87655c307ad6027d7"],["/archives/2019/index.html","f1e2c3e99b7f59ec0170c91d3ba99ad0"],["/archives/index.html","977f8d54db63b08d8161b87cdf6ab475"],["/archives/page/10/index.html","661c799049297568149dee15f559f75f"],["/archives/page/2/index.html","1630758f97b259c9db6fac8691162447"],["/archives/page/3/index.html","555676d01b132ffb369f37f75bbf704a"],["/archives/page/4/index.html","72867532f999d94894a453f4ba46676d"],["/archives/page/5/index.html","cf4e3511855d5363ddef487774d6faee"],["/archives/page/6/index.html","92e7b5bf4f103bd4fd0a60422606e44a"],["/archives/page/7/index.html","9480d500800068f67b58a91d389a2935"],["/archives/page/8/index.html","5b745437d1a8e89de10eff62a9ad37d9"],["/archives/page/9/index.html","e5937cc6fabe63d8d1178204b2e3cb2f"],["/css/bootstrap.css","be665bb9f0f7fc89f515adb828fa0a9b"],["/css/bootstrap.min.css","58a49b3689d699cb72ffda7252d99fcb"],["/css/hux-blog.css","b669eb0511b08a52a6fa0037ef268aed"],["/css/hux-blog.min.css","7c52a5e8fd56bc562ae3115df1013793"],["/css/syntax.css","7f76d2bfdb381ddb5ecae3adbee461e2"],["/fonts/glyphicons-halflings-regular.eot","f4769f9bdb7466be65088239c12046d1"],["/fonts/glyphicons-halflings-regular.svg","89889688147bd7575d6327160d64e760"],["/fonts/glyphicons-halflings-regular.ttf","e18bbf611f2a2e43afc071aa2f4e1512"],["/fonts/glyphicons-halflings-regular.woff","fa2772327f55d8198301fdb8bcfc8158"],["/img/404-bg.jpg","8f22a4ecdbdd94fd10f25ba8a934fe1d"],["/img/about-bg.jpg","64285147432e40ef95b1a2ff869d75a5"],["/img/avatar.jpg","abbbad189b36cb1d0f01e689d361b034"],["/img/contact-bg.jpg","0e38f139028cb4a784071a5865b9be85"],["/img/home-bg-o.jpg","afbd595ed462e39a93a3b676aa2ea7a4"],["/img/home-bg.jpg","47e73ec09d800c915d07de3628411082"],["/img/icon/android-icon-144x144.png","d202a43f4acc9ab58d8b49db52f3b1bd"],["/img/icon/android-icon-192x192.png","3db39aa67a190c7cc228142c38ca3116"],["/img/icon/android-icon-36x36.png","564010017e892a6b155df282eb4219f1"],["/img/icon/android-icon-48x48.png","f253397924f9f26643c7c6a79db8ba1a"],["/img/icon/android-icon-72x72.png","5ec2b6219eeb2ce5ae6248a38b088de2"],["/img/icon/android-icon-96x96.png","dd08e7a189e9d04907ade304879573a7"],["/img/icon/apple-icon-114x114.png","0afdd9a37902c212f000f2f32a8e60d2"],["/img/icon/apple-icon-120x120.png","e4751e71e836f37d4c5fe262b0024dad"],["/img/icon/apple-icon-144x144.png","d202a43f4acc9ab58d8b49db52f3b1bd"],["/img/icon/apple-icon-152x152.png","93388257840293e1d40e81512fe01ab4"],["/img/icon/apple-icon-180x180.png","6190429a55a26ea620f8738fe3f86f85"],["/img/icon/apple-icon-57x57.png","afca9e7605c04cacf65241ef697b0dc0"],["/img/icon/apple-icon-60x60.png","7d312bb24cb3156775afed056ef7dd7b"],["/img/icon/apple-icon-72x72.png","5ec2b6219eeb2ce5ae6248a38b088de2"],["/img/icon/apple-icon-76x76.png","dda4b1174095d91bda96193e149bc0db"],["/img/icon/apple-icon-precomposed.png","c36f75fe9134eb5f6d25720f6dcfd8af"],["/img/icon/apple-icon.png","c36f75fe9134eb5f6d25720f6dcfd8af"],["/img/icon/favicon-16x16.png","7ff5e2f720a1ff68aff44956a7cd496e"],["/img/icon/favicon-32x32.png","aa12518f9eb4a5cd98aa32232757ada8"],["/img/icon/favicon-96x96.png","dd08e7a189e9d04907ade304879573a7"],["/img/icon/icon-128x128.png","685d7eda0555b997d8a911461592490f"],["/img/icon/icon-144x144.png","2764561b941647d7608be02fa39accef"],["/img/icon/icon-152x152.png","f51cdcd069f2e9a825e3717903b72fa0"],["/img/icon/icon-192x192.png","68893733522f8e023dcf00f33a6b072a"],["/img/icon/icon-384x384.png","68893733522f8e023dcf00f33a6b072a"],["/img/icon/icon-512x512.png","68893733522f8e023dcf00f33a6b072a"],["/img/icon/icon-72x72.png","cee41433a2cde5c6c96dfa13d1dd4f29"],["/img/icon/icon-96x96.png","d2b978d993bfbb81bfabfcafebfbba4a"],["/img/icon/ms-icon-144x144.png","d202a43f4acc9ab58d8b49db52f3b1bd"],["/img/icon/ms-icon-150x150.png","0de44329bf3786b62d2ff890987f3ebc"],["/img/icon/ms-icon-310x310.png","d533790d064141237c076cd34d7f229d"],["/img/icon/ms-icon-70x70.png","e604c81e7280860ff7e25a743756c907"],["/img/tag-bg.jpg","f7631fc49641e65a4ea663378526e323"],["/index.html","e444534f1b41ded365be959aa48958a1"],["/js/bootstrap.js","6bfd171748f088ad503cb07c080b1f33"],["/js/bootstrap.min.js","046ba2b5f4cff7d2eaaa1af55caa9fd8"],["/js/hux-blog.js","c55159aa9ce700288f00a5ac4d6c8597"],["/js/hux-blog.min.js","506a54b6cbf3629bb9e71b1bd09e6317"],["/js/jquery.js","cf26f8f0ccb06be71e92d8db0fb64ab5"],["/js/jquery.min.js","32015dd42e9582a80a84736f5d9a44d7"],["/js/jquery.nav.js","773b606a62ed173595099c9238c4728a"],["/js/jquery.tagcloud.js","29be493c486274b127c2d68503892ce5"],["/js/motto.min.js","32ac04a01348373cdd7d9799ca1baa5e"],["/js/scrollreveal.min.js","4606eec941fee1fea86cf4494c4f227f"],["/leetcode/index.html","8c4f5407ac348137756620507bc759a7"],["/page/10/index.html","b119c61ed14a07fa07d3c90016ee3d8b"],["/page/2/index.html","e24162b7692f796bc721ff9a1c7e8e9b"],["/page/3/index.html","ef5160ae0a89cdebe09679159a2f00a5"],["/page/4/index.html","2a319ea5c045b1e2ae1b149e01c6ab75"],["/page/5/index.html","89f40c3f0c77a97e988b5c0bacde04b2"],["/page/6/index.html","6ae14579e807024c18b566197a17ebe4"],["/page/7/index.html","e7a7b1814e7563cb2432ce8a1461ed87"],["/page/8/index.html","ff1b8655e41c4c2d09751383f3d481a7"],["/page/9/index.html","f9eef54368a5853242cd95da01345671"],["/sw-register.js","ac8dd9c82fcc92b7b295c4b27c5b1be2"],["/tags/Android/index.html","91f406d9aa3274034bf6ccd4af3d8ec7"],["/tags/Angular2/index.html","f300968364fce26d8c40d19f37fc5a99"],["/tags/Babel/index.html","c95996d07dd630591ae8b8fec24e8a50"],["/tags/C/index.html","538b56fabf29eb56664026d9181047b6"],["/tags/CSS/index.html","24e0fa8225395405c2c311f793bac430"],["/tags/Coffeescript/index.html","f30948aec93d9811392991888c9bdcf8"],["/tags/Compiler/index.html","be814d478a188d77ee69592032b85d05"],["/tags/Component/index.html","2d39b0c814d7f19b26c389e4bc1502a2"],["/tags/Design-Pattern/index.html","fe110b87776c11c632c10982a954e29c"],["/tags/Docker/index.html","387193915b17b6b7d2cc11a4324a09ad"],["/tags/ES6/index.html","a4553d6427b48cd83d633bea195fae42"],["/tags/Game/index.html","46c4aec6ad43de43dced6b8ac54f9c58"],["/tags/Gulp/index.html","9098ae7ff9fcae674193175ce0e75121"],["/tags/Hybird/index.html","2a6b40f18fad4670397355ab4ca881a7"],["/tags/JIT/index.html","34bb5c6ae760c1a44a72dab4bd524181"],["/tags/Javascirpt/index.html","d11ef54cad3ff8ad255df0f433b1d73b"],["/tags/Javascript/index.html","672b79c3930d0d88a93c0e038880e94f"],["/tags/Jest/index.html","e19818a7f22699278e4b7ae5e541bb9a"],["/tags/LeetCode/index.html","81d41e5909ed5cb6c4cc0d9d66d2422c"],["/tags/LeetCode/page/2/index.html","bd2d9d3338a3602a728d102cfd483c8f"],["/tags/LeetCode/page/3/index.html","6959846679f69031aa15906ee4648095"],["/tags/Leetcode/index.html","c93c9fbcd3610e8a18b211ba3c078410"],["/tags/Linux/index.html","04839d8a08ca753c3345609fd18aa826"],["/tags/Lyrics/index.html","b1f28e4a2cd20d5d80af5960af2657de"],["/tags/Mobx/index.html","b72f35204d1e1ff7d9329c34f760a12e"],["/tags/Mocha/index.html","f42a23af64f5dad0aab73ae59e21f1ea"],["/tags/Module/index.html","5712691180fbeeb55bf140d910b15f4a"],["/tags/Node-js/index.html","15df27fd8322407547b53506a6f5ca15"],["/tags/Note/index.html","190b8187ca3fd3d49f526470ce10e3ae"],["/tags/Object-C/index.html","f9ccd78503220e895e63131ca72ce4bd"],["/tags/Objective-C/index.html","951f17deb6ba4927dea789aa948566f8"],["/tags/PHP/index.html","7bf7c0249d5b060da2d23368ac76bd87"],["/tags/Python/index.html","34ba3b36d7a992b1b74c6e7119971a0c"],["/tags/Python/page/2/index.html","4aa6a6640bc100dd8abbf5d1d956174f"],["/tags/Python/page/3/index.html","7fbc093eaad6728d546f496625058cd4"],["/tags/React-js/index.html","7b383becc66051e5c11bc1fa9c25e396"],["/tags/React/index.html","2b4b0fbf516d4c05c36435adab65da6e"],["/tags/Redux/index.html","9e72ac40d1f8ddbe6e5e8cab03cf71e5"],["/tags/Require-js/index.html","affd8717f5371e4829a3d5d220858919"],["/tags/SSR/index.html","55d7d7c36dc6f5c25d843fb72028951d"],["/tags/SegmentFault/index.html","9758f1b3c2ac3f94c661f40a36fd7044"],["/tags/Swift/index.html","45e99b660a45d6759190a01d976ccbc5"],["/tags/Template-Engine/index.html","64f121dbb3816897b18fec2e2bcf2369"],["/tags/Test/index.html","fe343b884e145752ee7b242b8c2bb551"],["/tags/Twig/index.html","d147789b1172be7639594a99cabd8c06"],["/tags/Typescript/index.html","738c4b590d71271a8589a0ab412e03d4"],["/tags/V8/index.html","fbcffd0dbb30e9453521ac47ff275128"],["/tags/WebAPI/index.html","46cdae9aef61ba600e0e147c710d87a4"],["/tags/Webpack/index.html","c98fb6344a28ede67bda17d2183ed98d"],["/tags/Webview/index.html","7e86dd0b6186d4ed4b3fc83a2e189cd9"],["/tags/Windows/index.html","69194d2b416b31073bb6cdd0e99acc11"],["/tags/base64/index.html","1da7ecef3253affa6917deb50a42ff3c"],["/tags/bootstrap/index.html","113cc58df760304aaa8b3cbaa640d0de"],["/tags/ci/index.html","5cfe599c0997f9408a3ce6619ca66a54"],["/tags/codepen/index.html","b1a22c5cf63a062af10a79553170b60f"],["/tags/compact/index.html","7cab45b309ec50396755f3ec286a12d3"],["/tags/css/index.html","77c2cb34cd741ec4d4f21a5c319f186b"],["/tags/docker/index.html","33d018504367dd392c668f8df563dc59"],["/tags/event/index.html","f91f50f7e7e0cb4559cd67e83cd35d41"],["/tags/facebook/index.html","63826e5b7d6fd92804a8414e327d9e64"],["/tags/flask/index.html","f7fb7ee1767c61af16c66333bf6bcebd"],["/tags/flow/index.html","3c4cd56eebcf06b18722a832ebbba657"],["/tags/i18n/index.html","5578324ab70aed275e61cf5de1fee2a6"],["/tags/iOS/index.html","df817547d2fc069a55d4f299d4b55f3c"],["/tags/iOS/page/2/index.html","40d5f056d54dc6bbfc6ec68e8806b53b"],["/tags/index.html","0d8f8bae27a22eb9cbfcb4d97b4c4995"],["/tags/javascirpt/index.html","ba95feeab7ff522362612fa597bbec24"],["/tags/jquery/index.html","c0843d39a5edd38fff43592b2a6e6d33"],["/tags/npm/index.html","e3ad911125b5d1b9440f2a0b8874165a"],["/tags/pwn/index.html","3c95c59b90596bd7be02f23ba9e5c456"],["/tags/python/index.html","7eefcf47afb4552daec7de4e94fce31c"],["/tags/shell/index.html","74c09fe509f3b179e77c4a4d60d99772"],["/tags/ssh/index.html","d6698624e4c2d21dfdfa27ae305f008e"],["/tags/svg/index.html","198b91b515fbbaf4ec25ba85ce36c66e"],["/tags/translate/index.html","76928a6b31c4d58ed5c73390440071c7"],["/tags/translation/index.html","93b548ba1f996ea8c435ca6ec83b8ddc"],["/tags/underscore/index.html","6d95439128ce840fa28ad5201ab64aaf"],["/tags/video-js/index.html","9ab04af704801c3c8184ef3dc40d8417"],["/tags/webpack/index.html","ad8ef59d8dc54bff2136a823e2b51fd4"],["/tags/函数式编程/index.html","7a5c7385bb357c423e7dead43c9db8a7"],["/tags/各种开发者大会/index.html","1a8a42a51efedf1471c6d9b101c28a69"],["/tags/文档/index.html","b823b8b25057552decffc33235ea2525"],["/tags/构建工具/index.html","b3b70f9f3f6dde4717b7f1ea711dfcb7"],["/tags/测试/index.html","020a3d78dea556e854f04edefd4d03cc"],["/tags/生活/index.html","c87139aada75c43f74edb375b6bd9ca4"],["/tags/笔记/index.html","0a2d2e5a4ce7de005ad569352ea6343c"],["/tags/读书笔记/index.html","bcee26148c59c70749c00a9c6d37c3de"],["/tags/逆向/index.html","d521b9f107f09afd9142dab72978539c"],["/tags/随笔/index.html","6f9d63ea7897fa3bdfa37ea24da8cb75"],["/tags/－-Test-Karma/index.html","39c6a767e475b1cc468e2dc7fb68bf2f"],["/tags/－-杂谈/index.html","822af08714f851c68422bf09f5850c60"],["/tags/－生活/index.html","3adb82e3772347607ed57f7e7769dac0"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');
var firstRegister = 1; // 默认1是首次安装SW， 0是SW更新


var ignoreUrlParametersMatching = [/^utm_/];


var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
        url.pathname += index;
    }
    return url.toString();
};

var cleanResponse = function (originalResponse) {
    // 如果没有重定向响应，不需干啥
    if (!originalResponse.redirected) {
        return Promise.resolve(originalResponse);
    }

    // Firefox 50 及以下不知处 Response.body 流, 所以我们需要读取整个body以blob形式返回。
    var bodyPromise = 'body' in originalResponse ?
        Promise.resolve(originalResponse.body) :
        originalResponse.blob();

    return bodyPromise.then(function (body) {
        // new Response() 可同时支持 stream or Blob.
        return new Response(body, {
            headers: originalResponse.headers,
            status: originalResponse.status,
            statusText: originalResponse.statusText
        });
    });
};

var createCacheKey = function (originalUrl, paramName, paramValue,
    dontCacheBustUrlsMatching) {

    // 创建一个新的URL对象，避免影响原始URL
    var url = new URL(originalUrl);

    // 如果 dontCacheBustUrlsMatching 值没有设置，或是没有匹配到，将值拼接到url.serach后
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
        url.search += (url.search ? '&' : '') +
            encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
};

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // 如果 whitelist 是空数组，则认为全部都在白名单内
    if (whitelist.length === 0) {
        return true;
    }

    // 否则逐个匹配正则匹配并返回
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function (whitelistedPathRegex) {
        return path.match(whitelistedPathRegex);
    });
};

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // 移除 hash; 查看 https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // 是否包含 '?'
        .split('&') // 分割成数组 'key=value' 的形式
        .map(function (kv) {
            return kv.split('='); // 分割每个 'key=value' 字符串成 [key, value] 形式
        })
        .filter(function (kv) {
            return ignoreUrlParametersMatching.every(function (ignoredRegex) {
                return !ignoredRegex.test(kv[0]); // 如果 key 没有匹配到任何忽略参数正则，就 Return true
            });
        })
        .map(function (kv) {
            return kv.join('='); // 重新把 [key, value] 格式转换为 'key=value' 字符串
        })
        .join('&'); // 将所有参数 'key=value' 以 '&' 拼接

    return url.toString();
};


var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
        url.pathname += index;
    }
    return url.toString();
};

var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
    precacheConfig.map(function (item) {
        var relativeUrl = item[0];
        var hash = item[1];
        var absoluteUrl = new URL(relativeUrl, self.location);
        var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
        return [absoluteUrl.toString(), cacheKey];
    })
);

function setOfCachedUrls(cache) {
    return cache.keys().then(function (requests) {
        // 如果原cacheName中没有缓存任何收，就默认是首次安装，否则认为是SW更新
        if (requests && requests.length > 0) {
            firstRegister = 0; // SW更新
        }
        return requests.map(function (request) {
            return request.url;
        });
    }).then(function (urls) {
        return new Set(urls);
    });
}

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return setOfCachedUrls(cache).then(function (cachedUrls) {
                return Promise.all(
                    Array.from(urlsToCacheKeys.values()).map(function (cacheKey) {
                        // 如果缓存中没有匹配到cacheKey，添加进去
                        if (!cachedUrls.has(cacheKey)) {
                            var request = new Request(cacheKey, { credentials: 'same-origin' });
                            return fetch(request).then(function (response) {
                                // 只要返回200才能继续，否则直接抛错
                                if (!response.ok) {
                                    throw new Error('Request for ' + cacheKey + ' returned a ' +
                                        'response with status ' + response.status);
                                }

                                return cleanResponse(response).then(function (responseToCache) {
                                    return cache.put(cacheKey, responseToCache);
                                });
                            });
                        }
                    })
                );
            });
        })
            .then(function () {
            
            // 强制 SW 状态 installing -> activate
            return self.skipWaiting();
            
        })
    );
});

self.addEventListener('activate', function (event) {
    var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.keys().then(function (existingRequests) {
                return Promise.all(
                    existingRequests.map(function (existingRequest) {
                        // 删除原缓存中相同键值内容
                        if (!setOfExpectedUrls.has(existingRequest.url)) {
                            return cache.delete(existingRequest);
                        }
                    })
                );
            });
        }).then(function () {
            
            return self.clients.claim();
            
        }).then(function () {
                // 如果是首次安装 SW 时, 不发送更新消息（是否是首次安装，通过指定cacheName 中是否有缓存信息判断）
                // 如果不是首次安装，则是内容有更新，需要通知页面重载更新
                if (!firstRegister) {
                    return self.clients.matchAll()
                        .then(function (clients) {
                            if (clients && clients.length) {
                                clients.forEach(function (client) {
                                    client.postMessage('sw.update');
                                })
                            }
                        })
                }
            })
    );
});



    self.addEventListener('fetch', function (event) {
        if (event.request.method === 'GET') {

            // 是否应该 event.respondWith()，需要我们逐步的判断
            // 而且也方便了后期做特殊的特殊
            var shouldRespond;


            // 首先去除已配置的忽略参数及hash
            // 查看缓存简直中是否包含该请求，包含就将shouldRespond 设为true
            var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
            shouldRespond = urlsToCacheKeys.has(url);

            // 如果 shouldRespond 是 false, 我们在url后默认增加 'index.html'
            // (或者是你在配置文件中自行配置的 directoryIndex 参数值)，继续查找缓存列表
            var directoryIndex = 'index.html';
            if (!shouldRespond && directoryIndex) {
                url = addDirectoryIndex(url, directoryIndex);
                shouldRespond = urlsToCacheKeys.has(url);
            }

            // 如果 shouldRespond 仍是 false，检查是否是navigation
            // request， 如果是的话，判断是否能与 navigateFallbackWhitelist 正则列表匹配
            var navigateFallback = '';
            if (!shouldRespond &&
                navigateFallback &&
                (event.request.mode === 'navigate') &&
                isPathWhitelisted([], event.request.url)
            ) {
                url = new URL(navigateFallback, self.location).toString();
                shouldRespond = urlsToCacheKeys.has(url);
            }

            // 如果 shouldRespond 被置为 true
            // 则 event.respondWith()匹配缓存返回结果，匹配不成就直接请求.
            if (shouldRespond) {
                event.respondWith(
                    caches.open(cacheName).then(function (cache) {
                        return cache.match(urlsToCacheKeys.get(url)).then(function (response) {
                            if (response) {
                                return response;
                            }
                            throw Error('The cached response that was expected is missing.');
                        });
                    }).catch(function (e) {
                        // 如果捕获到异常错误，直接返回 fetch() 请求资源
                        console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
                        return fetch(event.request);
                    })
                );
            }
        }
    });









/* eslint-enable */
