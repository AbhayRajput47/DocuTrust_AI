"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
    FileText,
    MessageSquare,
    Database,
    Bot
} from "lucide-react";

export default function DashboardStats() {

    const [stats, setStats] = useState({
        documents: 0,
        questions: 0,
        chunks: 0,
        responses: 0,
    });

useEffect(() => {

    const fetchStats = () => {
        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`)
            .then((res) => setStats(res.data));
    };

    fetchStats();

    const interval = setInterval(fetchStats, 2000);

    return () => clearInterval(interval);

}, []);

    const cards = [
        {
            title: "Documents",
            value: stats.documents,
            icon: FileText,
        },
        {
            title: "Questions",
            value: stats.questions,
            icon: MessageSquare,
        },
        {
            title: "Chunks",
            value: stats.chunks,
            icon: Database,
        },
        {
            title: "Responses",
            value: stats.responses,
            icon: Bot,
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 m-3">

            {cards.map((card) => {

                const Icon = card.icon;

                return (

                    <div
                        key={card.title}
                        className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm text-slate-400">
                                    {card.title}
                                </p>

                                <h2 className="mt-1 text-3xl font-bold text-white">
                                    {card.value}
                                </h2>

                            </div>

                            <div className="rounded-2xl bg-cyan-500/10 p-3">

                                <Icon
                                    className="text-cyan-300"
                                    size={22}
                                />

                            </div>

                        </div>

                    </div>

                );

            })}

        </div>
    );
}