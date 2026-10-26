(() => {
    "use strict";
    const dashboard = document.querySelector("[data-dashboard]");
    if (!dashboard) return;
    const admin = dashboard.dataset.dashboard === "admin";
    const { get, save, escape: e, money, serviceNames, status } = MoveNest;
    let bookingPage = 1;
    let selectedInvoice = null;
    let selectedMessage = null;
    const $ = (selector) => document.querySelector(selector);
    const badge = (value) =>
        `<span class="status ${String(value).toLowerCase().replace(/ /g, "-")}">${e(value)}</span>`;
    const allBookings = () => get().bookings.filter((b) => admin || b.customer === "C001");
    const customer = (b) =>
        get().customers.find((c) => c.id === b.customer) || {
            name: "Sample customer",
            email: "sample@example.com",
        };
    const shortDate = (date) =>
        new Date(date + "T12:00:00").toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    const kpi = (label, value, sub = "From shared sample data") =>
        `<article class="kpi-card"><span class="kpi-label">${label}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 20h16M7 16V9m5 7V4m5 12v-6"/></svg></span><strong class="kpi-value">${value}</strong><span class="kpi-sub">${sub}</span></article>`;
    function renderKpis() {
        const target = $("#kpis");
        if (!target) return;
        const bookings = allBookings();
        const pending = bookings.filter((b) => !b.paid);
        const today = new Date().toLocaleDateString("en-CA");
        const month = today.slice(0, 7);
        target.innerHTML = admin
            ? [
                  kpi("Total bookings", bookings.length),
                  kpi(
                      "Monthly revenue",
                      money(
                          bookings
                              .filter((b) => b.paid && b.date.startsWith(month))
                              .reduce((a, b) => a + b.total, 0),
                      ),
                      "Paid sample invoices · " + month,
                  ),
                  kpi(
                      "Active moves",
                      bookings.filter((b) => !["Delivered", "Cancelled"].includes(b.status)).length,
                  ),
                  kpi("Completed moves", bookings.filter((b) => b.status === "Delivered").length),
                  kpi("Registered customers", get().customers.length),
                  kpi("Pending invoices", pending.length),
              ].join("")
            : [
                  kpi("Total bookings", bookings.length),
                  kpi(
                      "Upcoming moves",
                      bookings.filter(
                          (b) => b.date >= today && !["Delivered", "Cancelled"].includes(b.status),
                      ).length,
                  ),
                  kpi("Completed moves", bookings.filter((b) => b.status === "Delivered").length),
                  kpi("Pending payments", money(pending.reduce((a, b) => a + b.total, 0))),
              ].join("");
    }
    function filteredBookings() {
        const search = ($("#booking-search")?.value || "").trim().toLowerCase();
        const filter = $("#booking-status")?.value || "";
        const sort = $("#booking-sort")?.value || "date-desc";
        return allBookings()
            .filter(
                (b) =>
                    (!filter || b.status === filter) &&
                    `${b.id} ${customer(b).name} ${b.pickup} ${b.delivery}`
                        .toLowerCase()
                        .includes(search),
            )
            .sort((a, b) =>
                sort === "amount-desc"
                    ? b.total - a.total
                    : sort === "date-asc"
                      ? a.date.localeCompare(b.date)
                      : b.date.localeCompare(a.date),
            );
    }
    function renderBookings() {
        const tbody = $("#bookings-body");
        if (!tbody) return;
        const rows = filteredBookings();
        const pageCount = Math.max(1, Math.ceil(rows.length / 6));
        bookingPage = Math.min(bookingPage, pageCount);
        tbody.innerHTML =
            rows
                .slice((bookingPage - 1) * 6, bookingPage * 6)
                .map(
                    (b) =>
                        `<tr><td><strong>${e(b.id)}</strong><small>${serviceNames[b.service]}</small></td><td><strong>${e(customer(b).name)}</strong><small>${e(b.pickup)} → ${e(b.delivery)}</small></td><td>${shortDate(b.date)}</td><td>${money(b.total)}</td><td>${badge(b.status)}</td><td><button class="filter-btn" data-booking="${e(b.id)}">Details</button></td></tr>`,
                )
                .join("") ||
            '<tr><td colspan="6"><div class="empty-state">No bookings match your search. Try another filter.</div></td></tr>';
        $("#booking-pagination").innerHTML = Array.from(
            { length: pageCount },
            (_, i) =>
                `<button class="${i + 1 === bookingPage ? "active" : ""}" data-booking-page="${i + 1}" aria-label="Booking page ${i + 1}">${i + 1}</button>`,
        ).join("");
    }
    function detailGrid(b) {
        const crew = get().crews.find((c) => c.id === b.crew);
        return `<dl class="detail-grid">${[
            ["Booking", b.id],
            ["Customer", customer(b).name],
            ["Service", serviceNames[b.service]],
            ["Date", shortDate(b.date)],
            ["Pickup", b.pickup],
            ["Delivery", b.delivery],
            ["Home size", ["Studio / 1 BHK", "2–3 BHK", "Large home / villa"][b.size] || "Custom"],
            ["Crew", crew ? crew.name + " · " + crew.lead : "Awaiting assignment"],
            ["Time window", b.time || "To be arranged"],
            ["Inventory", b.inventory || "Standard household inventory"],
        ]
            .map(([k, v]) => `<div><dt>${k}</dt><dd>${e(v)}</dd></div>`)
            .join("")}</dl>`;
    }
    function showBooking(id) {
        const b = allBookings().find((b) => b.id === id);
        if (!b) return;
        $("#dialog-title").textContent = "Booking " + b.id;
        $("#dialog-body").innerHTML =
            `${badge(b.status)}${detailGrid(b)}${estimateTable({ breakdown: b.breakdown, total: b.total })}${admin ? `<form id="status-form" style="margin-top:25px"><label for="edit-status">Update sample status</label><div class="actions"><select id="edit-status" name="status" style="flex:1">${[...status, "Cancelled"].map((s) => `<option ${s === b.status ? "selected" : ""}>${s}</option>`).join("")}</select><button class="btn" type="submit">Save status</button></div><p class="form-message" role="status"></p></form>` : `<div class="actions" style="margin-top:25px"><a class="btn" href="move-tracking.html?booking=${encodeURIComponent(b.id)}">Track this move</a><a class="btn btn-outline" href="invoices.html?booking=${encodeURIComponent(b.id)}">View invoice</a></div>`}`;
        $("#detail-dialog").showModal();
        $("#status-form")?.addEventListener("submit", (event) => {
            event.preventDefault();
            const data = get();
            data.bookings.find((x) => x.id === id).status = $("#edit-status").value;
            save(data);
            $("#status-form .form-message").textContent = "Status updated across the local sample.";
        });
    }
    const milestones = ["Confirmed", "Crew Assigned", "Packing", "In Transit", "Delivered"];
    function tracking(b, full = true) {
        if (!b)
            return '<div class="empty-state">No active sample move. Create a new booking to get started.</div>';
        const index = milestones.indexOf(b.status);
        return `<div class="actions" style="justify-content:space-between"><strong>${e(b.id)}</strong>${badge(b.status)}</div><div class="route-summary"><div><small>From</small><strong>${e(b.pickup)}</strong></div><span>→</span><div><small>To</small><strong>${e(b.delivery)}</strong></div></div><div class="tracking-timeline">${milestones.map((s, i) => `<div class="tracking-point ${i <= index ? "done" : ""} ${i === index ? "current" : ""}" ${i === index ? 'aria-current="step"' : ""}><span class="milestone-marker" aria-hidden="true">${i < index ? "&#10003;" : String(i + 1).padStart(2, "0")}</span><div class="milestone-copy"><b>${s}</b><span>${i < index ? "Completed" : i === index ? "Current milestone" : "Upcoming"}</span></div></div>`).join("")}</div>${full ? detailGrid(b) + `<p class="form-note">Illustrative schedule · ${e(b.time)}. No live GPS or dispatch data.</p><a class="btn btn-outline" href="../pages/contact.html">Contact support</a>` : `<span class="small">Preferred date: ${shortDate(b.date)} · Sample schedule</span>`}`;
    }
    function renderTracking() {
        if ($("#active-move"))
            $("#active-move").innerHTML = tracking(
                allBookings().find((b) => !["Delivered", "Cancelled"].includes(b.status)),
                false,
            );
        const select = $("#tracking-select");
        if (!select) return;
        const previous = select.value || new URLSearchParams(location.search).get("booking");
        const bookings = allBookings();
        select.innerHTML = bookings
            .map(
                (b) =>
                    `<option value="${e(b.id)}">${e(b.id)} · ${e(b.pickup)} → ${e(b.delivery)}</option>`,
            )
            .join("");
        if (bookings.some((b) => b.id === previous)) select.value = previous;
        $("#tracking-content").innerHTML = tracking(bookings.find((b) => b.id === select.value));
    }
    function renderInvoices() {
        if (!$("#invoices-body")) return;
        const bookings = allBookings();
        const filter = $("#invoice-filter").value;
        const search = $("#invoice-search").value.toLowerCase();
        $("#invoice-summary").innerHTML =
            kpi("Total invoiced", money(bookings.reduce((a, b) => a + b.total, 0))) +
            kpi("Paid", money(bookings.filter((b) => b.paid).reduce((a, b) => a + b.total, 0))) +
            kpi(
                "Outstanding",
                money(bookings.filter((b) => !b.paid).reduce((a, b) => a + b.total, 0)),
            ) +
            kpi("Invoice count", bookings.length);
        $("#invoices-body").innerHTML =
            bookings
                .filter(
                    (b) =>
                        (!filter || (b.paid ? "Paid" : "Unpaid") === filter) &&
                        `INV-${b.id} ${customer(b).name}`.toLowerCase().includes(search),
                )
                .map(
                    (b) =>
                        `<tr><td><strong>INV-${e(b.id)}</strong><small>${e(b.id)}</small></td><td>${e(customer(b).name)}</td><td>${shortDate(b.date)}</td><td>${money(b.total)}</td><td>${badge(b.paid ? "Paid" : "Unpaid")}</td><td><button class="filter-btn" data-invoice="${e(b.id)}">View invoice</button></td></tr>`,
                )
                .join("") ||
            '<tr><td colspan="6"><div class="empty-state">No matching invoices.</div></td></tr>';
        if (selectedInvoice) showInvoice(selectedInvoice, false);
    }
    function showInvoice(id, scroll = true) {
        const b = allBookings().find((b) => b.id === id);
        if (!b) return;
        selectedInvoice = id;
        const detail = $("#invoice-detail");
        detail.hidden = false;
        detail.innerHTML = `<div class="invoice-head"><div><span class="eyebrow">MoveNest · Sample invoice</span><h2>Invoice INV-${e(b.id)}</h2><p>Booking ${e(b.id)} · ${shortDate(b.date)}</p></div><div>${badge(b.paid ? "Paid" : "Unpaid")}<div class="actions no-print" style="margin-top:15px"><button class="btn btn-outline" data-print>Print invoice</button>${admin && !b.paid ? `<button class="btn" data-paid="${e(b.id)}">Mark paid (sample)</button>` : ""}</div></div></div><div class="invoice-meta"><div><strong>From</strong><p>MoveNest · Fictional business<br>24 Greenway Avenue, Bengaluru<br>hello@movenest.example</p></div><div><strong>Bill to</strong><p>${e(customer(b).name)}<br>${e(customer(b).email)}<br>${e(b.pickup)}</p></div></div><p class="small">${serviceNames[b.service]} · ${e(b.pickup)} → ${e(b.delivery)}</p>${estimateTable({ breakdown: b.breakdown, total: b.total })}<p class="form-note">Taxes: not applied in this sample. No tax invoice or payment receipt is issued. Illustrative charges only.</p>`;
        if (scroll) detail.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    function renderCustomers() {
        const target = $("#customers-body");
        if (!target) return;
        const search = ($("#customer-search").value || "").toLowerCase();
        target.innerHTML =
            get()
                .customers.filter((c) =>
                    `${c.name} ${c.email} ${c.city}`.toLowerCase().includes(search),
                )
                .map(
                    (c) =>
                        `<tr><td><strong>${e(c.name)}</strong><small>${e(c.id)}</small></td><td>${e(c.email)}</td><td>${e(c.city)}</td><td>${get().bookings.filter((b) => b.customer === c.id).length}</td><td><button class="filter-btn" data-customer="${c.id}">Profile & history</button></td></tr>`,
                )
                .join("") ||
            '<tr><td colspan="5"><div class="empty-state">No matching customers.</div></td></tr>';
    }
    function renderCrew() {
        if (!$("#crew-directory")) return;
        const data = get();
        $("#crew-directory").innerHTML = data.crews
            .map((c) => {
                const count = data.bookings.filter(
                    (b) => b.crew === c.id && !["Delivered", "Cancelled"].includes(b.status),
                ).length;
                return `<article class="panel"><span class="avatar" style="margin:0 0 20px">${e(c.name.slice(0, 1))}T</span><h3>${e(c.name)}</h3><p class="small">${e(c.lead)} · Crew lead<br>${c.members} members · ${e(c.city)}</p>${badge(count ? count + " active moves" : "Available")}</article>`;
            })
            .join("");
        const selected = $("#crew-booking").value;
        $("#crew-booking").innerHTML = data.bookings
            .filter((b) => !["Delivered", "Cancelled"].includes(b.status))
            .map(
                (b) =>
                    `<option value="${b.id}">${b.id} · ${e(b.pickup)} · ${shortDate(b.date)}</option>`,
            )
            .join("");
        if ([...$("#crew-booking").options].some((o) => o.value === selected))
            $("#crew-booking").value = selected;
        $("#crew-choice").innerHTML = data.crews
            .map((c) => `<option value="${c.id}">${e(c.name)} · ${c.members} members</option>`)
            .join("");
        $("#crew-schedule").innerHTML = data.bookings
            .filter((b) => !["Delivered", "Cancelled"].includes(b.status))
            .sort((a, b) => a.date.localeCompare(b.date))
            .map(
                (b) =>
                    `<tr><td>${b.id}</td><td>${shortDate(b.date)}</td><td>${e(data.crews.find((c) => c.id === b.crew)?.name || "Unassigned")}</td><td>${e(b.pickup)} → ${e(b.delivery)}</td></tr>`,
            )
            .join("");
    }
    function renderMessages() {
        if (!$("#message-list")) return;
        const messages = get().messages;
        const search = $("#message-search").value.toLowerCase();
        $("#unread-count").textContent = messages.filter((m) => !m.read).length + " unread";
        $("#message-list").innerHTML =
            messages
                .filter((m) => `${m.name} ${m.message}`.toLowerCase().includes(search))
                .map(
                    (m) =>
                        `<button class="message-item ${m.read ? "" : "unread"}" data-message="${e(m.id)}"><strong>${e(m.name)} ${m.read ? "" : "•"}</strong><small>${e(m.date)}</small><p>${e(m.message.slice(0, 85))}…</p></button>`,
                )
                .join("") || '<div class="empty-state">No matching messages.</div>';
        if (selectedMessage) {
            const m = messages.find((m) => m.id === selectedMessage);
            if (m)
                $("#message-detail").innerHTML =
                    `<span class="eyebrow">${e(m.date)} · Sample inquiry</span><h3>${e(m.name)}</h3><span class="small">${e(m.email)}</span><hr class="divider"><p>${e(m.message)}</p><button class="filter-btn" data-message-unread="${e(m.id)}">Mark unread</button><p class="form-note">Replies require a real messaging backend.</p>`;
        }
    }
    function renderOverviewLists() {
        const data = get();
        if ($("#recent-customers"))
            $("#recent-customers").innerHTML = data.customers
                .slice(0, 4)
                .map(
                    (c) =>
                        `<div class="activity-row"><span class="avatar">${e(
                            c.name
                                .split(" ")
                                .map((n) => n[0])
                                .join(""),
                        )}</span><div><strong>${e(c.name)}</strong><small>${e(c.city)}</small></div><span class="status">${data.bookings.filter((b) => b.customer === c.id).length} moves</span></div>`,
                )
                .join("");
        if ($("#recent-crew"))
            $("#recent-crew").innerHTML = data.crews
                .map(
                    (c) =>
                        `<div class="activity-row"><div><strong>${e(c.name)}</strong><small>${e(c.lead)} · ${e(c.city)}</small></div><span class="status">${data.bookings.filter((b) => b.crew === c.id && !["Delivered", "Cancelled"].includes(b.status)).length} active</span></div>`,
                )
                .join("");
        if ($("#pending-invoices"))
            $("#pending-invoices").innerHTML = data.bookings
                .filter((b) => !b.paid)
                .slice(0, 4)
                .map(
                    (b) =>
                        `<div class="activity-row"><div><strong>INV-${b.id}</strong><small>${e(customer(b).name)}</small></div><a class="text-link" href="admin-invoices.html?booking=${b.id}">${money(b.total)}</a></div>`,
                )
                .join("");
    }
    function populateSettings() {
        const form = $("#settings-form") || $("#profile-form");
        if (!form) return;
        const data = get()[admin ? "settings" : "profile"];
        for (const [key, value] of Object.entries(data)) {
            const input = form.elements[key];
            if (input) {
                if (input.type === "checkbox") input.checked = Boolean(value);
                else input.value = value;
            }
        }
        const theme = localStorage.getItem("movenest-theme");
        form.elements.theme.value = theme === "dark" ? "2" : theme === "light" ? "1" : "0";
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!form.reportValidity()) return;
            const values = Object.fromEntries(new FormData(form));
            const data = get();
            if (admin) {
                for (const key of ["base0", "base1", "base2", "distanceRate"])
                    values[key] = Number(values[key]);
                data.settings = { ...data.settings, ...values };
            } else {
                data.profile = {
                    ...data.profile,
                    ...values,
                    notifications: form.elements.notifications.checked,
                    updates: form.elements.updates.checked,
                };
                const c = data.customers.find((c) => c.id === "C001");
                c.name = values.name;
                c.email = values.email;
                c.phone = values.phone;
            }
            save(data);
            const theme = ["system", "light", "dark"][Number(values.theme)];
            if (theme === "system") {
                localStorage.removeItem("movenest-theme");
                document.documentElement.dataset.theme = matchMedia("(prefers-color-scheme: dark)")
                    .matches
                    ? "dark"
                    : "light";
            } else {
                localStorage.setItem("movenest-theme", theme);
                document.documentElement.dataset.theme = theme;
            }
            window.dispatchEvent(new Event("theme-change"));
            form.querySelector(".form-message").textContent = "Changes saved in this browser.";
        });
    }
    const csvCell = (value) =>
        '"' +
        String(value ?? "")
            .replace(/^[=+@-]/, "'$&")
            .replace(/"/g, '""') +
        '"';
    function exportCsv(type) {
        let rows;
        const data = get();
        if (type === "customers")
            rows = [
                ["ID", "Name", "Email", "City"],
                ...data.customers.map((c) => [c.id, c.name, c.email, c.city]),
            ];
        else {
            let bookings =
                type === "report"
                    ? window.getReportBookings?.() || allBookings()
                    : type === "bookings"
                      ? filteredBookings()
                      : allBookings();
            rows = [
                [
                    "Booking",
                    "Customer",
                    "Service",
                    "Date",
                    "Pickup",
                    "Delivery",
                    "Total INR",
                    "Status",
                    "Paid",
                ],
                ...bookings.map((b) => [
                    b.id,
                    customer(b).name,
                    serviceNames[b.service],
                    b.date,
                    b.pickup,
                    b.delivery,
                    b.total,
                    b.status,
                    b.paid ? "Yes" : "No",
                ]),
            ];
        }
        const blob = new Blob(
            ["\uFEFF" + rows.map((row) => row.map(csvCell).join(",")).join("\r\n")],
            { type: "text/csv;charset=utf-8" },
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "movenest-" + type + ".csv";
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        notify("Sample CSV exported.");
    }
    document.addEventListener("click", (event) => {
        const target = event.target.closest("button");
        if (!target) return;
        if (target.dataset.booking) showBooking(target.dataset.booking);
        if (target.dataset.bookingPage) {
            bookingPage = Number(target.dataset.bookingPage);
            renderBookings();
        }
        if (target.dataset.invoice) showInvoice(target.dataset.invoice);
        if (target.hasAttribute("data-print")) window.print();
        if (target.dataset.paid) {
            const data = get();
            data.bookings.find((b) => b.id === target.dataset.paid).paid = true;
            save(data);
            notify("Sample invoice marked paid. No payment was processed.");
        }
        if (target.dataset.customer) {
            const c = get().customers.find((c) => c.id === target.dataset.customer);
            $("#dialog-title").textContent = c.name;
            $("#dialog-body").innerHTML =
                `<p>${e(c.email)}<br>${e(c.phone)}<br>${e(c.city)}</p><h3>Booking history</h3>${get()
                    .bookings.filter((b) => b.customer === c.id)
                    .map(
                        (b) =>
                            `<div class="activity-row"><div><strong>${b.id} · ${serviceNames[b.service]}</strong><small>${shortDate(b.date)} · ${money(b.total)}</small></div>${badge(b.status)}</div>`,
                    )
                    .join("")}`;
            $("#detail-dialog").showModal();
        }
        if (target.dataset.message) {
            selectedMessage = target.dataset.message;
            const data = get();
            data.messages.find((m) => m.id === selectedMessage).read = true;
            save(data);
        }
        if (target.dataset.messageUnread) {
            const data = get();
            data.messages.find((m) => m.id === target.dataset.messageUnread).read = false;
            save(data);
        }
        if (target.dataset.export) exportCsv(target.dataset.export);
    });
    for (const selector of ["#booking-search", "#booking-status", "#booking-sort"])
        $(selector)?.addEventListener("input", () => {
            bookingPage = 1;
            renderBookings();
        });
    $("#tracking-select")?.addEventListener("change", renderTracking);
    for (const selector of ["#invoice-search", "#invoice-filter"])
        $(selector)?.addEventListener("input", renderInvoices);
    $("#customer-search")?.addEventListener("input", renderCustomers);
    $("#message-search")?.addEventListener("input", renderMessages);
    $("#crew-form")?.addEventListener("submit", (event) => {
        event.preventDefault();
        const bookingId = $("#crew-booking").value;
        const crewId = $("#crew-choice").value;
        const data = get();
        const b = data.bookings.find((b) => b.id === bookingId);
        if (!b) {
            notify("No active booking to assign.");
            return;
        }
        const conflict = data.bookings.some(
            (other) =>
                other.id !== b.id &&
                other.crew === crewId &&
                other.date === b.date &&
                !["Delivered", "Cancelled"].includes(other.status),
        );
        if (conflict) {
            $("#crew-form .form-message").textContent =
                "This crew already has an active move on that date. Choose another crew.";
            return;
        }
        b.crew = crewId;
        if (["Pending", "Confirmed"].includes(b.status)) b.status = "Crew Assigned";
        save(data);
        $("#crew-form .form-message").textContent = "Crew assignment saved across the sample.";
    });
    function render() {
        if (location.pathname.endsWith("/customer-dashboard.html")) {
            $(".dashboard-heading h1").textContent =
                "Welcome back, " + (get().profile.name || "friend").split(" ")[0];
        }
        renderKpis();
        renderBookings();
        renderTracking();
        renderInvoices();
        renderCustomers();
        renderCrew();
        renderMessages();
        renderOverviewLists();
    }
    populateSettings();
    render();
    const requested = new URLSearchParams(location.search).get("booking");
    if (requested && $("#invoice-detail")) showInvoice(requested, false);
    window.addEventListener("demo-data-change", render);
    window.addEventListener("storage", (event) => {
        if (event.key === "movenest-demo-v1") {
            render();
            window.dispatchEvent(new Event("demo-data-change"));
        }
    });
})();
