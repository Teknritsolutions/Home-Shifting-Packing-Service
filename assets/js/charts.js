(() => {
    "use strict";
    const canvases = [...document.querySelectorAll("[data-chart]")];
    if (!canvases.length) return;
    if (typeof Chart === "undefined") {
        canvases.forEach(
            (canvas) =>
                (canvas.parentElement.innerHTML =
                    "<p>Charts could not load. Booking totals remain available in the tables.</p>"),
        );
        return;
    }
    const instances = [];
    let from = "2026-01-01",
        to = "2026-12-31";
    window.getReportBookings = () =>
        MoveNest.get().bookings.filter((b) => b.date >= from && b.date <= to);
    function render() {
        instances.forEach((chart) => chart.destroy());
        instances.length = 0;
        const { get, money } = MoveNest;
        const dark = document.documentElement.dataset.theme === "dark";
        const text = dark ? "#b9c9bf" : "#52625b";
        const grid = dark ? "#35493e" : "#e1e9e1";
        const colors = dark
            ? ["#a5cdb1", "#c7a66a", "#6e9b86", "#d0ddd0"]
            : ["#174c3c", "#c7a66a", "#668b76", "#a7c4a0"];
        const bookings = document.querySelector("#report-filter")
            ? window.getReportBookings()
            : get().bookings;
        const labels = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        canvases.forEach((canvas) => {
            let type = canvas.dataset.chart;
            let data;
            let horizontal = false;
            if (
                canvas.id === "revenue" ||
                canvas.id === "performance" ||
                canvas.id === "customer-activity"
            ) {
                const customer = canvas.id === "customer-activity";
                const revenue = canvas.id === "revenue";
                const values = labels.map((_, i) =>
                    bookings
                        .filter(
                            (b) =>
                                Number(b.date.slice(5, 7)) === i + 1 &&
                                (!customer || b.customer === "C001") &&
                                (!revenue || b.paid),
                        )
                        .reduce((total, b) => total + (revenue ? b.total : 1), 0),
                );
                data = {
                    labels,
                    datasets: [
                        {
                            label: revenue ? "Paid sample revenue (INR)" : "Sample bookings",
                            data: values,
                            borderColor: colors[0],
                            backgroundColor:
                                type === "line" ? (dark ? "#a5cdb11f" : "#174c3c12") : colors[0],
                            fill: type === "line",
                            tension: 0.35,
                            borderRadius: 5,
                            borderWidth: type === "line" ? 2 : 0,
                            pointRadius: type === "line" ? 3 : 0,
                            maxBarThickness: 28,
                        },
                    ],
                };
            } else if (canvas.id === "customer-status" || canvas.id === "customer-payments") {
                const own = bookings.filter((b) => b.customer === "C001");
                const payment = canvas.id === "customer-payments";
                const labels = payment
                    ? ["Paid", "Outstanding"]
                    : ["Upcoming", "In progress", "Delivered", "Cancelled"];
                const values = payment
                    ? [
                          own.filter((b) => b.paid).reduce((n, b) => n + b.total, 0),
                          own.filter((b) => !b.paid).reduce((n, b) => n + b.total, 0),
                      ]
                    : [
                          own.filter((b) =>
                              ["Pending", "Confirmed", "Crew Assigned"].includes(b.status),
                          ).length,
                          own.filter((b) => ["Packing", "In Transit"].includes(b.status)).length,
                          own.filter((b) => b.status === "Delivered").length,
                          own.filter((b) => b.status === "Cancelled").length,
                      ];
                data = {
                    labels,
                    datasets: [
                        {
                            label: payment ? "Amount (INR)" : "Bookings",
                            data: values,
                            backgroundColor: colors,
                            borderWidth: 0,
                            borderRadius: payment ? 6 : 0,
                            maxBarThickness: 48,
                        },
                    ],
                };
            } else if (canvas.id === "distribution") {
                data = {
                    labels: Object.values(MoveNest.serviceNames),
                    datasets: [
                        {
                            data: Object.keys(MoveNest.serviceNames).map(
                                (s) => bookings.filter((b) => b.service === s).length,
                            ),
                            backgroundColor: colors,
                            borderWidth: 0,
                            hoverOffset: 5,
                        },
                    ],
                };
            } else {
                horizontal = true;
                const statuses = [
                    "Pending",
                    "Confirmed",
                    "Crew Assigned",
                    "Packing",
                    "In Transit",
                    "Delivered",
                ];
                data = {
                    labels: statuses,
                    datasets: [
                        {
                            label: "Sample bookings",
                            data: statuses.map(
                                (s) => bookings.filter((b) => b.status === s).length,
                            ),
                            backgroundColor: colors[2],
                            borderRadius: 4,
                            maxBarThickness: 20,
                        },
                    ],
                };
            }
            const doughnut = type === "doughnut";
            instances.push(
                new Chart(canvas, {
                    type,
                    data,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: horizontal ? "y" : "x",
                        animation: matchMedia("(prefers-reduced-motion: reduce)").matches
                            ? false
                            : { duration: 250 },
                        layout: { padding: { top: 16, right: 8, bottom: 0, left: 0 } },
                        plugins: {
                            legend: {
                                display: doughnut,
                                position: "bottom",
                                labels: {
                                    color: text,
                                    usePointStyle: true,
                                    boxWidth: 8,
                                    padding: 15,
                                    font: { family: "Inter", size: 14 },
                                },
                            },
                            tooltip: {
                                backgroundColor: dark ? "#f1f5ef" : "#182d26",
                                titleColor: dark ? "#182d26" : "#fff",
                                bodyColor: dark ? "#182d26" : "#fff",
                            },
                        },
                        ...(doughnut
                            ? { cutout: "72%" }
                            : {
                                  scales: {
                                      x: {
                                          grid: { display: horizontal, color: grid },
                                          ticks: {
                                              color: text,
                                              font: { family: "Inter", size: 14 },
                                              maxRotation: 0,
                                              autoSkip: true,
                                              maxTicksLimit: horizontal ? 6 : 12,
                                          },
                                          border: { display: false },
                                      },
                                      y: {
                                          beginAtZero: true,
                                          grace: "15%",
                                          grid: { color: grid, display: !horizontal },
                                          ticks: {
                                              color: text,
                                              font: { family: "Inter", size: 14 },
                                              precision: 0,
                                          },
                                          border: { display: false },
                                      },
                                  },
                              }),
                    },
                }),
            );
        });
        const summary = document.querySelector("#report-summary");
        if (summary) {
            const total = bookings.reduce((a, b) => a + b.total, 0);
            const paid = bookings.filter((b) => b.paid).reduce((a, b) => a + b.total, 0);
            summary.innerHTML = [
                ["Filtered bookings", bookings.length],
                ["Invoiced", money(total)],
                ["Paid revenue", money(paid)],
                ["Outstanding", money(total - paid)],
            ]
                .map(
                    ([label, value]) =>
                        `<article class="kpi-card"><span class="kpi-label">${label}</span><strong class="kpi-value">${value}</strong><span class="kpi-sub">Selected date range</span></article>`,
                )
                .join("");
        }
    }
    document.querySelector("#report-filter")?.addEventListener("submit", (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.reportValidity()) return;
        if (form.elements.from.value > form.elements.to.value) {
            form.querySelector(".form-message").textContent =
                "The end date must be on or after the start date.";
            return;
        }
        from = form.elements.from.value;
        to = form.elements.to.value;
        render();
        form.querySelector(".form-message").textContent =
            `Showing ${window.getReportBookings().length} sample bookings in the selected date range.`;
    });
    render();
    window.addEventListener("theme-change", render);
    window.addEventListener("demo-data-change", render);
})();
