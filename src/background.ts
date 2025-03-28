chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.action === "clearCookies") {
        const domain = message.domain;
        console.log(`Attempting to clear cookies for: ${domain}`);

        chrome.cookies.getAll({ domain }, (cookies) => {
            if (!cookies || cookies.length === 0) {
                console.log(`No cookies found for ${domain}`);
                sendResponse({ success: false, message: "No cookies found." });
                return;
            }

            let cookiesCleared = 0;
            cookies.forEach((cookie) => {
                chrome.cookies.remove({
                    url: `https://${cookie.domain}${cookie.path}`,
                    name: cookie.name,
                });
                cookiesCleared++;
            });

            console.log(`Cleared ${cookiesCleared} cookies for ${domain}`);
            sendResponse({ success: cookiesCleared > 0, message: cookiesCleared > 0 ? "Cookies cleared!" : "No cookies found." });
        });

        return true;
    }
});
