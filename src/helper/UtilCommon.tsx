const checkIsMobile = (breakpoint = 768) => {
    const screenWidth = window.screen.width;
    const isMobile = screenWidth < breakpoint;
    return isMobile;
};

const removeHtmlTags = (input: string): string => {
    return input.replace(/<\/?[^>]+(>|$)/g, "");
};

const capitalizeFirstLetter = (input: string) => {
  return input?.charAt(0)?.toUpperCase() + input?.slice(1);
}

export {checkIsMobile, removeHtmlTags, capitalizeFirstLetter}