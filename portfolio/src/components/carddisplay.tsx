
import { useEffect, useState } from "react";
import axios from "axios";

import Mobile from "../assets/icon/mobile.png";
import Cube from "../assets/icon/cube.png";
import Web from "../assets/icon/web-design (1).png";

import StarryNight from "./bg/background";

interface Service {
    _id: string;
    serviceType: "web" | "mobile" | "design";
}

interface ServiceCount {
    web: number;
    mobile: number;
    design: number;
}

export default function CardDisplay() {
    const [count, setCount] = useState<ServiceCount>({
        web: 0,
        mobile: 0,
        design: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const fetchCounts = async () => {
            const API_BASE_URL =
                import.meta.env.VITE_API_BASE_URL ||
                "https://lenodev-production.up.railway.app";

            try {
                // First, try the statistics endpoint.
                try {
                    const statsResponse = await axios.get(
                        `${API_BASE_URL}/api/user-services/stats/count-by-type`
                    );

                    if (statsResponse.data.success) {
                        const countObj: ServiceCount = {
                            web: 0,
                            mobile: 0,
                            design: 0,
                        };

                        statsResponse.data.data.forEach(
                            (item: { _id: string; count: number }) => {
                                if (
                                    item._id === "web" ||
                                    item._id === "mobile" ||
                                    item._id === "design"
                                ) {
                                    countObj[item._id] = item.count;
                                }
                            }
                        );

                        if (!cancelled) {
                            setCount(countObj);
                        }

                        return;
                    }
                } catch (statsError) {
                    console.warn(
                        "Stats endpoint failed. Trying the services endpoint.",
                        statsError
                    );
                }

                // Fallback: fetch all services and count manually.
                const servicesResponse = await axios.get(
                    `${API_BASE_URL}/api/user-services`
                );

                if (servicesResponse.data.success) {
                    const services: Service[] =
                        servicesResponse.data.data;

                    const calculatedCounts: ServiceCount = {
                        web: services.filter(
                            (service) => service.serviceType === "web"
                        ).length,

                        mobile: services.filter(
                            (service) => service.serviceType === "mobile"
                        ).length,

                        design: services.filter(
                            (service) => service.serviceType === "design"
                        ).length,
                    };

                    if (!cancelled) {
                        setCount(calculatedCounts);
                    }
                }
            } catch (error) {
                console.error("Error fetching service counts:", error);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchCounts();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <section className="services-section">
            {/* Animated starry night background */}
            <StarryNight />

            {/* Content stays above the background */}
            <div className="services-content">
                <div className="services-heading">
                    <p className="services-eyebrow">WHAT I DO</p>

                    <h2>My Services</h2>

                    <p className="services-subtitle">
                        Turning ideas into digital experiences through
                        development, design, and technology.
                    </p>
                </div>

                <div className="card-display">
                    {/* Full-Stack Development */}
                    <div className="card">
                        {loading ? (
                            <>
                                <div className="skeleton-img" />
                                <h1>Full-Stack Development</h1>
                                <h3>Loading...</h3>
                            </>
                        ) : (
                            <>
                                <img
                                    src={Web}
                                    alt="Web Development"
                                />

                                <h1>Full-Stack Development</h1>

                                <h3>
                                    {count.web}{" "}
                                    {count.web === 1
                                        ? "project"
                                        : "projects"}
                                </h3>
                            </>
                        )}
                    </div>

                    {/* Product Design */}
                    <div className="card">
                        {loading ? (
                            <>
                                <div className="skeleton-img" />
                                <h1>Product Design</h1>
                                <h3>Loading...</h3>
                            </>
                        ) : (
                            <>
                                <img
                                    src={Cube}
                                    alt="Product Design"
                                />

                                <h1>Product Design</h1>

                                <h3>
                                    {count.design}{" "}
                                    {count.design === 1
                                        ? "project"
                                        : "projects"}
                                </h3>
                            </>
                        )}
                    </div>

                    {/* Mobile App Development */}
                    <div className="card">
                        {loading ? (
                            <>
                                <div className="skeleton-img" />
                                <h1>Mobile App Development</h1>
                                <h3>Loading...</h3>
                            </>
                        ) : (
                            <>
                                <img
                                    src={Mobile}
                                    alt="Mobile App Development"
                                />

                                <h1>Mobile App Development</h1>

                                <h3>
                                    {count.mobile}{" "}
                                    {count.mobile === 1
                                        ? "project"
                                        : "projects"}
                                </h3>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
