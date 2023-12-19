interface HealthBarProps {
	maxHealth: number;
	currentHealth: number;
}

const HealthBar: React.FC<HealthBarProps> = ({ maxHealth, currentHealth }) => {
	// Calculate the percentage of health
	const healthPercentage = (currentHealth / maxHealth) * 100;

	return (
		<div className="health-bar">
			<div className="health-bar-inner" style={{ width: `${healthPercentage}%` }}>
				{currentHealth}/{maxHealth} Health
			</div>
		</div>
	);
};

export default HealthBar;
