export class BurstChartChildren{
    name: string;
    children: BurstChartChildren[];
}

export class ChartData {
    chordChartData: {
        keys: string[], // Example: ["name 1", "name 2", "name 3"]
        data: number [][], // Example: [ [0, 32, 12], [32, 0, 24], [12, 24, 0] ]
    };
    burstChartData: {
        flare: string,
        children: BurstChartChildren[]
    };
    directedChartData: {
        trendingUp: {
            tag: { 
                name: string,
                count: number,
                pastDays: [ 
                    {
                        date: Date,
                        count: number
                    }
                ]
            }
        },
        trendingDown: {
            tag: {
                name: string,
                count: number,
                pastDays: [
                    {
                        date: Date,
                        count: number,
                    }
                ]
            }
        },
        random: {
            tag: {
                name: string,
                count: number,
                pastDays: [
                    {
                        date: Date,
                        count: number
                    }
                ]
            }
        }
    }
}