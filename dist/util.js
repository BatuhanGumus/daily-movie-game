export function rectDistance(rect1, rect2) {
    const center1X = rect1.left + rect1.width / 2;
    const center1Y = rect1.top + rect1.height / 2;
    const center2X = rect2.left + rect2.width / 2;
    const center2Y = rect2.top + rect2.height / 2;
    return distance(center1X, center1Y, center2X, center2Y);
}
function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}
export const vw = (percent) => {
    return window.innerWidth * (percent / 100);
};
export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function setPosition(element, rect) {
    element.style.top = rect.top + "px";
    element.style.left = rect.left + "px";
}
export function AnimateToPosition(element, rect) {
    var leftStart = element.style.left;
    var topStart = element.style.top;
    const animation = element.animate([
        {
            top: `${topStart}px`,
            left: `${leftStart}px`
        },
        {
            top: `${rect.top}px`,
            left: `${rect.left}px`
        }
    ], {
        duration: rectDistance(element.getBoundingClientRect(), rect) * 0.6,
        fill: 'none',
        easing: 'ease-out',
    });
    animation.onfinish = () => {
        setPosition(element, rect);
    };
}
export function showToast(message, duration = 3000) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "40px";
    toast.style.right = "40px";
    toast.style.padding = "30px 40px";
    toast.style.backgroundColor = "#222";
    toast.style.color = "#fff";
    toast.style.fontSize = "1.5rem";
    toast.style.fontWeight = "bold";
    toast.style.borderRadius = "16px";
    toast.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";
    toast.style.zIndex = "9999";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.5s ease, transform 0.3s ease";
    toast.style.transform = "translateY(20px)";
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    });
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
        setTimeout(() => toast.remove(), 500);
    }, duration);
}
