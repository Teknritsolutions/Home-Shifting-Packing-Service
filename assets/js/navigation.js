(() => {
    "use strict";
    const menu = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav-main");
    const groups = [...document.querySelectorAll(".nav-dropdown")];
    const navIcons = {
        Home: '<path d="m3 10 9-7 9 7v11h-6v-7H9v7H3z"/>',
        "About Us": '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
        Services: '<path d="m3 7 9-4 9 4v10l-9 4-9-4zM3 7l9 5 9-5M12 12v9"/>',
        Pricing:
            '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2m4 0h2m-8 4h2m4 0h2"/>',
        More: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
        Contact: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
        Dashboards:
            '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    };
    nav?.querySelectorAll(":scope > .nav-link, .nav-dropdown-heading > .nav-link").forEach(
        (link) => {
            const paths = navIcons[link.textContent.trim()];
            if (paths)
                link.insertAdjacentHTML(
                    "afterbegin",
                    `<svg class="drawer-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`,
                );
        },
    );
    document.querySelectorAll(".mobile-nav-close, .nav-backdrop").forEach((button) =>
        button.addEventListener("click", () => {
            closeMenu();
            menu?.focus();
        }),
    );
    nav?.addEventListener("keydown", (event) => {
        if (event.key !== "Tab" || !nav.classList.contains("is-open")) return;
        const items = [...nav.querySelectorAll("a, button")].filter(
            (el) => el.getClientRects().length,
        );
        const first = items[0],
            last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

    const desktopHover = () => matchMedia("(hover: hover) and (min-width: 1280px)").matches;
    function setGroup(group, open) {
        group.classList.toggle("is-open", open);
        group.querySelector(".nav-dropdown-toggle").setAttribute("aria-expanded", String(open));
        group.querySelector(".nav-group-label")?.setAttribute("aria-expanded", String(open));
        group.querySelector(".dropdown").hidden = !open;
    }
    function closeGroups(except) {
        groups.forEach((group) => {
            if (group !== except) setGroup(group, false);
        });
    }
    function closeMenu() {
        document.body.classList.remove("nav-drawer-open");
        const backdrop = document.querySelector(".nav-backdrop");
        if (backdrop) backdrop.hidden = true;
        nav?.classList.remove("is-open");
        menu?.setAttribute("aria-expanded", "false");
        menu?.setAttribute("aria-label", "Open navigation");
        closeGroups();
    }
    menu?.addEventListener("click", () => {
        const open = !nav.classList.contains("is-open");
        nav.classList.toggle("is-open", open);
        document.body.classList.toggle("nav-drawer-open", open);
        const backdrop = document.querySelector(".nav-backdrop");
        if (backdrop) backdrop.hidden = !open;
        if (open) nav.querySelector(".mobile-nav-close")?.focus();
        menu.setAttribute("aria-expanded", String(open));
        menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
        if (!open) closeGroups();
    });
    groups.forEach((group) => {
        let closeTimer;
        const open = () => {
            clearTimeout(closeTimer);
            closeGroups(group);
            setGroup(group, true);
        };
        group.querySelector(".nav-group-label")?.addEventListener("click", () => {
            const wasOpen = group.classList.contains("is-open");
            closeGroups(group);
            setGroup(group, !wasOpen);
        });
        group.addEventListener("pointerenter", () => {
            if (desktopHover()) open();
        });
        group.addEventListener("pointerleave", () => {
            if (desktopHover())
                closeTimer = setTimeout(() => {
                    if (!group.contains(document.activeElement)) setGroup(group, false);
                }, 160);
        });
        group.querySelector(".nav-dropdown-toggle").addEventListener("click", () => {
            const wasOpen = group.classList.contains("is-open");
            closeGroups(group);
            setGroup(group, !wasOpen);
        });
        group.addEventListener("focusout", () =>
            setTimeout(() => {
                if (!group.contains(document.activeElement) && !group.matches(":hover"))
                    setGroup(group, false);
            }, 0),
        );
        group.querySelector(".nav-dropdown-toggle").addEventListener("keydown", (event) => {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                open();
                group.querySelector(".dropdown a")?.focus();
            }
        });
        group.querySelector(".dropdown").addEventListener("keydown", (event) => {
            const links = [...group.querySelectorAll(".dropdown a")];
            const index = links.indexOf(document.activeElement);
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                const direction = event.key === "ArrowDown" ? 1 : -1;
                links[(index + direction + links.length) % links.length]?.focus();
            }
            if (event.key === "Escape") {
                event.stopPropagation();
                setGroup(group, false);
                group.querySelector(".nav-dropdown-toggle").focus();
            }
        });
    });
    const normalizedPath = (path) => (path.endsWith("/") ? path + "index.html" : path);
    const currentPath = normalizedPath(location.pathname);
    const currentQuery = new URLSearchParams(location.search);
    document.querySelectorAll(".nav-main a").forEach((link) => {
        const target = new URL(link.href);
        const query = new URLSearchParams(target.search);
        let active = normalizedPath(target.pathname) === currentPath;
        if (query.has("service"))
            active = active && query.get("service") === (currentQuery.get("service") || "local");
        if (active) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
            link.closest(".nav-dropdown")?.classList.add("is-active");
        }
        if (target.pathname.endsWith("/blog.html") && currentPath.endsWith("/blog-details.html")) {
            link.classList.add("active");
            link.closest(".nav-dropdown")?.classList.add("is-active");
        }
    });
    if (currentPath.endsWith("/home-2.html"))
        document.querySelector('[data-nav-group="home"]')?.classList.add("is-active");
    if (currentPath.endsWith("/service-details.html"))
        document.querySelector('[data-nav-group="services"]')?.classList.add("is-active");
    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        const drawer = document.querySelector(".dashboard-sidebar");
        const drawerOpen = drawer?.classList.contains("is-open");
        const menuOpen = nav?.classList.contains("is-open");
        closeMenu();
        drawer?.classList.remove("is-open");
        document.querySelector(".sidebar-toggle")?.setAttribute("aria-expanded", "false");
        if (drawerOpen) document.querySelector(".sidebar-toggle")?.focus();
        else if (menuOpen) menu?.focus();
    });
    document.addEventListener("click", (event) => {
        if (!event.target.closest(".site-header")) closeMenu();
        if (
            !event.target.closest(".dashboard-sidebar") &&
            !event.target.closest(".sidebar-toggle")
        ) {
            document.querySelector(".dashboard-sidebar")?.classList.remove("is-open");
            document.querySelector(".sidebar-toggle")?.setAttribute("aria-expanded", "false");
        }
    });
    document.querySelector(".sidebar-toggle")?.addEventListener("click", (event) => {
        const open = document.querySelector(".dashboard-sidebar").classList.toggle("is-open");
        event.currentTarget.setAttribute("aria-expanded", String(open));
    });
    let wasDesktop = innerWidth >= 1280;
    addEventListener(
        "resize",
        () => {
            const isDesktop = innerWidth >= 1280;
            if (wasDesktop !== isDesktop) closeMenu();
            wasDesktop = isDesktop;
        },
        { passive: true },
    );
    addEventListener(
        "scroll",
        () => document.querySelector(".site-header")?.classList.toggle("scrolled", scrollY > 15),
        { passive: true },
    );
})();
