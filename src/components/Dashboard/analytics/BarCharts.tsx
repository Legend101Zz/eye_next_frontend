import React, { useEffect, useState } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

const placeholderData = [
	{ name: "Jan", value: 65 },
	{ name: "Feb", value: 45 },
	{ name: "Mar", value: 85 },
	{ name: "Apr", value: 35 },
	{ name: "May", value: 55 },
	{ name: "Jun", value: 75 },
	{ name: "Jul", value: 40 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-black/90 p-4 rounded-lg shadow-lg border border-accent/20">
				<p className="text-white font-heading1">{label}</p>
				<p className="text-accent font-bold">
					{payload[0].value.toLocaleString()}
				</p>
			</div>
		);
	}
	return null;
};

const EmptyState = ({ onAddData }: { onAddData: () => void }) => (
	<motion.div
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
		className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-sm rounded-lg"
	>
		<motion.div
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			transition={{ type: "spring", bounce: 0.5 }}
			className="bg-black/90 p-6 rounded-xl text-center max-w-sm mx-auto"
		>
			<div className="font-heading1 text-xl text-white mb-3">
				No Data Available
			</div>
			<p className="text-gray-400 mb-4">
				As Soon as your sales start the data will be visualized here.
			</p>

		</motion.div>
	</motion.div>
);

const BarChartComponent = ({ data = [] }: { data: any[] }) => {
	const [animationData, setAnimationData] = useState(
		placeholderData.map(item => ({ ...item, value: 0 }))
	);

	useEffect(() => {
		if (!data || data.length === 0) {
			const timer = setTimeout(() => {
				setAnimationData(placeholderData);
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [data]);

	const chartData = data.length > 0 ? data : animationData;

	return (
		<div className="relative">
			<ResponsiveContainer width="100%" height={300}>
				<BarChart
					data={chartData}
					margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
				>
					<defs>
						<linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="#FF7D05" stopOpacity={0.8} />
							<stop offset="95%" stopColor="#FF7D05" stopOpacity={0.3} />
						</linearGradient>
					</defs>
					<CartesianGrid
						strokeDasharray="3 3"
						stroke="#333"
						opacity={0.1}
					/>
					<XAxis
						dataKey="name"
						stroke="#666"
						tick={{ fill: '#666' }}
					/>
					<YAxis
						stroke="#666"
						tick={{ fill: '#666' }}
					/>
					<Tooltip content={<CustomTooltip />} />
					<Legend
						wrapperStyle={{
							paddingTop: "20px",
							color: "#666"
						}}
					/>
					<Bar
						dataKey="value"
						fill="url(#barGradient)"
						radius={[4, 4, 0, 0]}
						animationDuration={2000}
						animationEasing="ease-in-out"
					/>
				</BarChart>
			</ResponsiveContainer>
			<AnimatePresence>
				{(!data || data.length === 0) && (
					<EmptyState onAddData={() => { }} />
				)}
			</AnimatePresence>
		</div>
	);
};

export default BarChartComponent;