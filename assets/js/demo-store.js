/* One shared, versioned browser-local store. No passwords or payment credentials. */
(() => {
    "use strict";
    const key = "movenest-demo-v1";
    const status = ["Pending", "Confirmed", "Crew Assigned", "Packing", "In Transit", "Delivered"];
    const serviceNames = {
        local: "Local home shifting",
        intercity: "Intercity relocation",
        packing: "Packing & unpacking",
        office: "Office relocation",
    };
    const customers = [
        {
            id: "C001",
            name: "Ananya Rao",
            email: "ananya@example.com",
            city: "Bengaluru",
            phone: "+91 80000 00001",
        },
        {
            id: "C002",
            name: "Vikram Shah",
            email: "vikram@example.com",
            city: "Mumbai",
            phone: "+91 80000 00002",
        },
        {
            id: "C003",
            name: "Meera Krishnan",
            email: "meera@example.com",
            city: "Chennai",
            phone: "+91 80000 00003",
        },
        {
            id: "C004",
            name: "Arjun Patel",
            email: "arjun@example.com",
            city: "Pune",
            phone: "+91 80000 00004",
        },
        {
            id: "C005",
            name: "Nisha Menon",
            email: "nisha@example.com",
            city: "Hyderabad",
            phone: "+91 80000 00005",
        },
    ];
    const crews = [
        { id: "T01", name: "Cedar team", lead: "Rohan Kapoor", members: 4, city: "Bengaluru" },
        { id: "T02", name: "Willow team", lead: "Sameer Nair", members: 3, city: "Pune" },
        { id: "T03", name: "Olive team", lead: "Aditi Shah", members: 5, city: "Hyderabad" },
    ];
    function seed() {
        const specs = [
            [
                "C001",
                "intercity",
                "2026-10-21",
                "In Transit",
                18500,
                "Bengaluru",
                "Pune",
                "T01",
                false,
            ],
            [
                "C001",
                "local",
                "2026-10-12",
                "Delivered",
                6500,
                "Bengaluru",
                "Bengaluru",
                "T01",
                true,
            ],
            [
                "C001",
                "packing",
                "2026-03-06",
                "Delivered",
                4800,
                "Bengaluru",
                "Bengaluru",
                "T01",
                true,
            ],
            ["C002", "office", "2026-11-05", "Confirmed", 32000, "Mumbai", "Pune", "T02", false],
            [
                "C003",
                "local",
                "2026-10-25",
                "Crew Assigned",
                9200,
                "Chennai",
                "Chennai",
                "T03",
                false,
            ],
            [
                "C004",
                "intercity",
                "2026-09-15",
                "Delivered",
                24000,
                "Pune",
                "Delhi NCR",
                "T02",
                true,
            ],
            [
                "C005",
                "packing",
                "2026-08-20",
                "Delivered",
                5500,
                "Hyderabad",
                "Hyderabad",
                "T03",
                true,
            ],
            ["C002", "local", "2026-06-11", "Delivered", 7000, "Mumbai", "Mumbai", "T02", true],
            [
                "C003",
                "intercity",
                "2026-05-09",
                "Delivered",
                21000,
                "Chennai",
                "Bengaluru",
                "T01",
                true,
            ],
            ["C004", "office", "2026-04-17", "Delivered", 28000, "Pune", "Pune", "T02", true],
            ["C005", "local", "2026-11-12", "Pending", 8500, "Hyderabad", "Hyderabad", "", false],
            ["C003", "packing", "2026-10-24", "Packing", 6000, "Chennai", "Chennai", "T03", false],
        ];
        return {
            version: 1,
            customers: structuredClone(customers),
            crews: structuredClone(crews),
            bookings: specs.map(
                ([customer, service, date, state, total, pickup, delivery, crew, paid], i) => ({
                    id: "MN-" + (1048 - i),
                    customer,
                    service,
                    date,
                    status: state,
                    total,
                    pickup,
                    delivery,
                    crew,
                    paid,
                    size: 1,
                    boxes: 35,
                    time: "Morning · 8 AM–12 PM",
                    inventory: "Sofa, dining table, beds and household boxes",
                    notes: "Fictional sample booking",
                    breakdown: {
                        base: Math.round(total * 0.6),
                        distance: Math.round(total * 0.15),
                        packing: Math.round(total * 0.1),
                        labor: Math.round(total * 0.15),
                        extras: 0,
                    },
                }),
            ),
            messages: [
                {
                    id: "M001",
                    name: "Meera Krishnan",
                    email: "meera@example.com",
                    message:
                        "Could we add extra protection for two large mirrors to our move? Thank you for helping us plan.",
                    date: "2026-10-20",
                    read: false,
                },
                {
                    id: "M002",
                    name: "Vikram Shah",
                    email: "vikram@example.com",
                    message:
                        "Our office loading bay is available from 8 AM. Please include this in the crew handover.",
                    date: "2026-10-19",
                    read: true,
                },
            ],
            settings: {
                name: "MoveNest",
                email: "hello@movenest.example",
                phone: "+91 80000 00000",
                address: "24 Greenway Avenue, Bengaluru",
                base0: 3000,
                base1: 6000,
                base2: 11000,
                distanceRate: 25,
            },
            profile: {
                name: "Ananya Rao",
                email: "ananya@example.com",
                phone: "+91 80000 00001",
                address: "Bengaluru",
                notifications: true,
                updates: true,
            },
        };
    }
    let memory;
    function get() {
        try {
            const value = JSON.parse(localStorage.getItem(key));
            if (value?.version === 1 && Array.isArray(value.bookings)) return value;
        } catch {}
        return memory || seed();
    }
    function save(data) {
        memory = data;
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch {
            window.dispatchEvent(new CustomEvent("storage-unavailable"));
        }
        window.dispatchEvent(new CustomEvent("demo-data-change"));
    }
    const escape = (text) =>
        String(text ?? "").replace(
            /[&<>"']/g,
            (char) =>
                ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char],
        );
    const money = (value) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(value || 0);
    function estimate(values) {
        const settings = get().settings;
        const size = Number(values.size) || 0;
        const breakdown = {
            base: Number(settings["base" + size]),
            distance: Math.round(
                Math.max(0, Number(values.distance) || 0) * Number(settings.distanceRate),
            ),
            packing: [1000, 2200, 0][Number(values.packing) || 0],
            labor:
                1000 +
                (Number(values.elevator) === 1 ? Math.max(0, Number(values.floor) || 0) * 350 : 0),
            extras: [0, 1200, 1800, 3000][Number(values.extras) || 0],
        };
        return { breakdown, total: Object.values(breakdown).reduce((a, b) => a + b, 0) };
    }
    function currentCustomer() {
        return get().customers.find((c) => c.id === "C001");
    }
    window.MoveNest = {
        get,
        save,
        seed,
        escape,
        money,
        estimate,
        status,
        serviceNames,
        currentCustomer,
    };
    try {
        if (!localStorage.getItem(key)) save(seed());
    } catch {
        memory = seed();
    }
})();
