/**
 * Data necessary for burst chart children
 * This should be the top tag of the discussion
 * Will need to think about how to handle multiple flares
 */
export class BurstChartChildren {
  name: string;
  children: BurstChartChildren[];

  constructor(partial?: any) {
    if (partial) {
      this.name = partial.name;
      this.children = partial.children
        ? partial.children.map((partial) => {
            return new BurstChartChildren(partial);
          })
        : [];
    }
  }
}

export class BurstChartData {
  flare: string;
  children: BurstChartChildren[];

  constructor(partial?: any) {
    if (partial) {
      this.flare = partial.flare;
      this.children = partial.children
        ? partial.children.map((partial) => {
            return new BurstChartChildren(partial);
          })
        : [];
    }
  }
}

/**
 * This will be how people are connected by tags
 */
export class ChordChartData {
  keys: string[]; // Example: ["name 1", "name 2", "name 3"]
  data: number[][]; // Example: [ [0, 32, 12], [32, 0, 24], [12, 24, 0] ]

  constructor(partial?: any) {
    if (partial) {
      this.keys = partial.keys;
      this.data = partial.data;
    }
  }
}

/**
 * This relates to the tag that has seen a trend up, trend down, and the most random.
 * Most random will be defined by the largest standard deviation
 */
export class DirectedChartData {
  trendingUp: {
    tag: TagData;
  };
  trendingDown: {
    tag: TagData;
  };
  random: {
    tag: TagData;
  };

  constructor(partial?: any) {
    if (partial) {
      this.trendingUp = partial.trendingUp;
      this.trendingDown = partial.trendingDown;
      this.random = partial.random;
    }
  }
}

export class TagData {
  name: string;
  count: number;
  pastDays: [
    {
      date: Date;
      count: number;
    },
  ];
}

export class ChartData {
  chordChartData: ChordChartData;
  burstChartData: BurstChartData;
  directedChartData: DirectedChartData;

  constructor(partial: Partial<ChartData>) {
    if (partial) {
      this.chordChartData = partial.chordChartData;
      this.burstChartData = partial.burstChartData;
      this.directedChartData = partial.directedChartData;
    }
  }
}
