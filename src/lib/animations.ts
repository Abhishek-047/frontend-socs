import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

// Register ScrollTrigger and TextPlugin immediately if in browser
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

// Function export for explicit registration if needed
export const registerGSAP = () => {
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);
  }
};

export const fadeUpOnScroll = (selector: string | Element | NodeListOf<Element>) => {
  return gsap.fromTo(
    selector,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: selector,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    }
  );
};

export const staggerCardsOnScroll = (containerSelector: string | Element) => {
  return gsap.fromTo(
    typeof containerSelector === "string" ? `${containerSelector} > *` : (containerSelector as Element).children,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 1.0,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerSelector,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    }
  );
};

export const typewriterEffect = (element: Element, text: string, speed = 0.05) => {
  element.textContent = "";
  return gsap.to(element, {
    text: text, // requires TextPlugin if using text param natively, or we do manual
    duration: text.length * speed,
    ease: "none",
  });
};

export const glitchReveal = (element: Element | string) => {
  const tl = gsap.timeline();
  tl.to(element, { opacity: 0.4, duration: 0.15, x: -2 })
    .to(element, { opacity: 1, duration: 0.15, x: 2 })
    .to(element, { opacity: 0.6, duration: 0.15, x: -1 })
    .to(element, { opacity: 1, duration: 0.15, x: 0 });
  return tl;
};

export const animateCounter = (element: Element, target: number, duration = 2) => {
  const obj = { val: 0 };
  return gsap.to(obj, {
    val: target,
    duration,
    ease: "power1.out",
    onUpdate: () => {
      element.innerHTML = Math.round(obj.val).toString();
    },
    scrollTrigger: {
      trigger: element,
      start: "top 90%",
      once: true,
    },
  });
};
