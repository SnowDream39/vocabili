
//  *                    _ooOoo_
//  *                   o8888888o
//  *                   88" . "88
//  *                   (| -_- |)
//  *                    O\ = /O
//  *                ____/`---'\____
//  *              .   ' \\| |// `.
//  *               / \\||| : |||// \
//  *             / _||||| -:- |||||- \
//  *               | | \\\ - /// | |
//  *             | \_| ''\---/'' | |
//  *              \ .-\__ `-` ___/-. /
//  *           ___`. .' /--.--\ `. . __
//  *        ."" '< `.___\_<|>_/___.' >'"".
//  *       | | : `- \`.;`\ _ /`;.`/ - ` : | |
//  *         \ \ `-. \_ __\ /__ _/ .-` / /
//  * ======`-.____`-.___\_____/___.-`____.-'======
//  *                    `=---='
//  *
//  * .............................................
//  *          佛祖保佑             永无BUG
document.addEventListener("DOMContentLoaded", function () {
    const AD_STORAGE_KEY = "ad_last_shown"; // 本地存储的键名
    const ONE_DAY = 24 * 60 * 60 * 1000; // 1 天的毫秒数

    // 读取上次广告弹出的时间
    const lastShownTime = localStorage.getItem(AD_STORAGE_KEY);
    const now = new Date().getTime();

    // 判断是否需要显示广告（一天一次）
    if (!lastShownTime || now - lastShownTime > ONE_DAY) {
        showAdModal();
    }

    function showAdModal() {
        // 创建遮罩层（带高斯模糊）
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.background = "rgba(0, 0, 0, 0.5)";
        overlay.style.backdropFilter = "blur(8px)"; // 高斯模糊
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.zIndex = "99999"; // 确保覆盖所有元素
        overlay.style.pointerEvents = "auto"; // 禁止用户跳过弹窗

        // 创建弹窗
        const modal = document.createElement("div");
        modal.style.width = "90vw"; // 自适应宽度
        modal.style.maxWidth = "400px"; // 最大宽度
        modal.style.padding = "20px";
        modal.style.margin = "10px";
        modal.style.backgroundColor = "white";
        modal.style.borderRadius = "10px";
        modal.style.textAlign = "center";
        modal.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.3)";
        modal.style.overflow = "hidden";

        // 标题
        const title = document.createElement("h2");
        title.textContent = "广告";
        modal.appendChild(title);

        // 提示信息
        const infoText = document.createElement("p");
        infoText.textContent = "请点击以下广告，直到所有广告展示完毕后才能关闭弹窗。还请为小站出一份小力，谢谢！弹窗一天一次";
        infoText.style.color = "#555";
        infoText.style.fontSize = "14px";
        infoText.style.marginBottom = "10px";
        modal.appendChild(infoText);

        // 计数器
        const counter = document.createElement("p");
        counter.style.color = "#ff0000";
        counter.style.fontSize = "14px";
        counter.style.marginBottom = "15px";
        modal.appendChild(counter);

        // 生成广告数据
        const ads = [
            { img: "https://a1.boltp.com/2025/03/21/67dd4ff374488.jpg", url: "https://ys.mihoyo.com" },
        ];

        let currentAdIndex = 0;
        updateCounter();

        // 广告容器
        const adContainer = document.createElement("div");
        adContainer.style.width = "100%";
        adContainer.style.height = "150px"; // 固定广告显示区域
        adContainer.style.display = "flex";
        adContainer.style.justifyContent = "center";
        adContainer.style.alignItems = "center";
        adContainer.style.overflow = "hidden";
        adContainer.style.position = "relative";

        // 创建广告图片
        const adImg = document.createElement("img");
        adImg.src = ads[currentAdIndex].img;
        adImg.style.width = "100%";
        adImg.style.borderRadius = "12px";
        adImg.style.cursor = "pointer";
        adImg.style.transition = "opacity 0.3s ease-in-out"; // 添加渐变动画
        adContainer.appendChild(adImg);

        // 添加广告容器
        modal.appendChild(adContainer);

        // 创建关闭按钮
        const closeButton = document.createElement("button");
        closeButton.textContent = "关闭";
        closeButton.disabled = true;
        closeButton.style.marginTop = "20px";
        closeButton.style.padding = "10px 20px";
        closeButton.style.border = "none";
        closeButton.style.backgroundColor = "#ccc";
        closeButton.style.color = "#fff";
        closeButton.style.borderRadius = "5px";
        closeButton.style.cursor = "not-allowed";

        closeButton.addEventListener("click", function () {
            if (closeButton.disabled) return;
            document.body.removeChild(overlay);
            localStorage.setItem(AD_STORAGE_KEY, now.toString());
        });

        modal.appendChild(closeButton);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 点击广告图片的逻辑
        adImg.addEventListener("click", function () {
            window.open(ads[currentAdIndex].url, "_blank"); // 打开广告链接

            currentAdIndex++; // 移动到下一个广告

            if (currentAdIndex < ads.length) {
                adImg.style.opacity = "0"; // 先隐藏当前广告
                setTimeout(() => {
                    adImg.src = ads[currentAdIndex].img; // 切换到下一个广告
                    adImg.style.opacity = "1"; // 再显示新的广告
                    updateCounter();
                }, 300);
            } else {
                // 所有广告都被点击后，启用关闭按钮
                closeButton.disabled = false;
                closeButton.style.backgroundColor = "#28a745";
                closeButton.style.cursor = "pointer";
                updateCounter();
            }
        });

        function updateCounter() {
            if (currentAdIndex < ads.length) {
                counter.textContent = `还剩 ${ads.length - currentAdIndex} 个广告`;
            } else {
                counter.textContent = "所有广告已点击完毕！";
            }
        }
    }
});