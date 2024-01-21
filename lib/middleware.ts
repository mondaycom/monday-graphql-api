export enum Status {
    HEALTHY = 'Healthy',
    UNHEALTHY = 'Unhealthy',
}

export class HealthCheck {
    private healthCheckStrategies: string[] = [];

    public withDb(client: string) {
        this.healthCheckStrategies.push('db');
        return this;
    }

    public withQueue(queue: string) {
        this.healthCheckStrategies.push('queue');
        return this;
    }

    public withStorage(storage: string) {
        this.healthCheckStrategies.push('storage');
        return this;
    }

    public async check() {
        return this.healthCheckStrategies.reduce((acc, strategy) => acc + strategy, ',');
    }
}
