
// MOCK DATA USED FOR TESTING PATCH

import { Types } from "mongoose";

var openDate = new Date("2022-06-20");
var closeDate = new Date("2022-06-25");


export const validCalendar = {
    'id': new Types.ObjectId('629a69deaa8494f552c89cd9'),
    'open': openDate,
    'close': closeDate,
    'posting': {
      'open': openDate,
      'close': closeDate,
    },
    'responding': {
      'open': openDate,
      'close': closeDate,
    },
    'synthesizing': {
      'open': openDate,
      'close': closeDate,
    }
}

export const openDateInPast = {
    'id': new Types.ObjectId('629a69deaa8494f552c89cd9'),
    'open': new Date("2022-01-01"),
    'close': closeDate,
    'posting': {
      'open': openDate,
      'close': closeDate,
    },
    'responding': {
      'open': openDate,
      'close': closeDate,
    },
    'synthesizing': {
      'open': openDate,
      'close': closeDate,
    }
}

export const openDateNotADate = {
    'id': new Types.ObjectId('629a69deaa8494f552c89cd9'),
    'open': "not a date",
    'close': closeDate,
    'posting': {
      'open': openDate,
      'close': closeDate,
    },
    'responding': {
      'open': openDate,
      'close': closeDate,
    },
    'synthesizing': {
      'open': openDate,
      'close': closeDate,
    }
}

export const openDateEmpty = {
  'id': new Types.ObjectId('629a69deaa8494f552c89cd9'),
  'open': "",
  'close': closeDate,
  'posting': {
    'open': openDate,
    'close': closeDate,
  },
  'responding': {
    'open': openDate,
    'close': closeDate,
  },
  'synthesizing': {
    'open': openDate,
    'close': closeDate,
  }
}

export const closeDateInPast = {
  'id': new Types.ObjectId('629a69deaa8494f552c89cd9'),
  'open': openDate,
  'close': new Date("2022-01-01"),
  'posting': {
    'open': openDate,
    'close': closeDate,
  },
  'responding': {
    'open': openDate,
    'close': closeDate,
  },
  'synthesizing': {
    'open': openDate,
    'close': closeDate,
  }
}

export const closeDateNotADate = {
  'id': new Types.ObjectId('629a69deaa8494f552c89cd9'),
  'open': openDate,
  'close': "not a date",
  'posting': {
    'open': openDate,
    'close': closeDate,
  },
  'responding': {
    'open': openDate,
    'close': closeDate,
  },
  'synthesizing': {
    'open': openDate,
    'close': closeDate,
  }
}

export const closeDateEmpty = {
'id': new Types.ObjectId('629a69deaa8494f552c89cd9'),
'open': openDate,
'close': "",
'posting': {
  'open': openDate,
  'close': closeDate,
},
'responding': {
  'open': openDate,
  'close': closeDate,
},
'synthesizing': {
  'open': openDate,
  'close': closeDate,
}
}

// POSTING ERRORS

export const postingEmpty = {
'id': new Types.ObjectId('629a69deaa8494f552c89cd9'),
'open': openDate,
 'close': closeDate,
  'posting': "",
  'responding': {
    'open': openDate,
    'close': closeDate,
  },
  'synthesizing': {
    'open': openDate,
    'close': closeDate,
  }
}

export const postingOpenPast = {
  'id': new Types.ObjectId('629a69deaa8494f552c89cd9'),
  'open': openDate,
  'close': closeDate,
  'posting': {
    'open': new Date("2022-01-01"),
    'close': closeDate,
  },
  'responding': {
    'open': openDate,
    'close': closeDate,
  },
  'synthesizing': {
    'open': openDate,
    'close': closeDate,
  }
}

export const postingOpenNotDate = {
  'id': new Types.ObjectId('629a69deaa8494f552c89cd9'),
  'open': openDate,
  'close': closeDate,
  'posting': {
    'open': "not a date",
    'close': closeDate,
  },
  'responding': {
    'open': openDate,
    'close': closeDate,
  },
  'synthesizing': {
    'open': openDate,
    'close': closeDate,
  }
}

export const postingOpenEmpty = {
  'id': new Types.ObjectId('629a69deaa8494f552c89cd9'),
  'open': openDate,
  'close': closeDate,
  'posting': {
    'open': "",
    'close': closeDate,
  },
  'responding': {
    'open': openDate,
    'close': closeDate,
  },
  'synthesizing': {
    'open': openDate,
    'close': closeDate,
  }
}

export const postingClosePast = {
  'id': new Types.ObjectId('629a69deaa8494f552c89cd9'),
  'open': openDate,
  'close': closeDate,
  'posting': {
    'open': openDate,
    'close': new Date("2022-01-01"),
  },
  'responding': {
    'open': openDate,
    'close': closeDate,
  },
  'synthesizing': {
    'open': openDate,
    'close': closeDate,
  }
}

export const postingCloseNotDate = {
  'id': new Types.ObjectId('629a69deaa8494f552c89cd9'),
  'open': openDate,
  'close': closeDate,
  'posting': {
    'open': openDate,
    'close': "not a date",
  },
  'responding': {
    'open': openDate,
    'close': closeDate,
  },
  'synthesizing': {
    'open': openDate,
    'close': closeDate,
  }
}

export const postingCloseEmpty = {
  'id': new Types.ObjectId('629a69deaa8494f552c89cd9'),
  'open': openDate,
  'close': closeDate,
  'posting': {
    'open': openDate,
    'close': "",
  },
  'responding': {
    'open': openDate,
    'close': closeDate,
  },
  'synthesizing': {
    'open': openDate,
    'close': closeDate,
  }
}

// RESPONDING ERRORS

export const respondingEmpty = {
  'id': new Types.ObjectId('629a69deaa8494f552c89cd9'),
  'open': openDate,
  'close': closeDate,
  'posting': {
    'open': openDate,
    'close': closeDate,
  },
  'responding': "",
  'synthesizing': {
    'open': openDate,
    'close': closeDate,
  }
}

export const respondingOpenPast = {
  'id': new Types.ObjectId('629a69deaa8494f552c89cd9'),
  'open': openDate,
  'close': closeDate,
  'posting': {
    'open': openDate,
    'close': closeDate,
  },
  'responding': {
    'open': new Date("2022-01-01"),
    'close': closeDate,
  },
  'synthesizing': {
    'open': openDate,
    'close': closeDate,
  }
}

export const respondingOpenNotDate = {
  'id': '629a69deaa8494f552c89cd9',
  'open': openDate,
  'close': closeDate,
  'posting': {
    'open': openDate,
    'close': closeDate,
  },
  'responding': {
    'open': 'not a date',
    'close': closeDate,
  },
  'synthesizing': {
    'open': openDate,
    'close': closeDate,
  }
}

export const respondingOpenEmpty = {
  'id': '629a69deaa8494f552c89cd9',
  'open': openDate,
  'close': closeDate,
  'posting': {
    'open': openDate,
    'close': closeDate,
  },
  'responding': {
    'open': '',
    'close': closeDate,
  },
  'synthesizing': {
    'open': openDate,
    'close': closeDate,
  }
}

export const respondingClosePast = {
  'id': '629a69deaa8494f552c89cd9',
  'open': openDate,
  'close': closeDate,
  'posting': {
    'open': openDate,
    'close': closeDate,
  },
  'responding': {
    'open': openDate,
    'close': new Date("2022-01-01"),
  },
  'synthesizing': {
    'open': openDate,
    'close': closeDate,
  }
}

export const respondingCloseNotDate = {
  'id': '629a69deaa8494f552c89cd9',
  'open': openDate,
  'close': closeDate,
  'posting': {
    'open': openDate,
    'close': closeDate,
  },
  'responding': {
    'open': openDate,
    'close': 'not a date',
  },
  'synthesizing': {
    'open': openDate,
    'close': closeDate,
  }
}

export const respondingCloseEmpty = {
  'id': '629a69deaa8494f552c89cd9',
  'open': openDate,
  'close': closeDate,
  'posting': {
    'open': openDate,
    'close': closeDate,
  },
  'responding': {
    'open': openDate,
    'close': '',
  },
  'synthesizing': {
    'open': openDate,
    'close': closeDate,
  }
}

// SYNTHESIZING ERRORS

export const synthesizingEmpty = {
  'id': '629a69deaa8494f552c89cd9',
  'open': openDate,
  'close': closeDate,
  'posting': {
    'open': openDate,
    'close': closeDate,
  },
  'responding': {
    'open': openDate,
    'close': closeDate,
  },
  'synthesizing': ''
}

export const synthesizingOpenPast = {
  'id': '629a69deaa8494f552c89cd9',
  'open': openDate,
  'close': closeDate,
  'posting': {
    'open': openDate,
    'close': closeDate,
  },
  'responding': {
    'open': openDate,
    'close': closeDate,
  },
  'synthesizing': {
    'open': new Date("2022-01-01"),
    'close': closeDate,
  }
}

export const synthesizingOpenNotDate = {
  'id': '629a69deaa8494f552c89cd9',
  'open': openDate,
  'close': closeDate,
  'posting': {
    'open': openDate,
    'close': closeDate,
  },
  'responding': {
    'open': openDate,
    'close': closeDate,
  },
  'synthesizing': {
    'open': 'not a date',
    'close': closeDate,
  }
}

export const synthesizingOpenEmpty = {
  'id': '629a69deaa8494f552c89cd9',
  'open': openDate,
  'close': closeDate,
  'posting': {
    'open': openDate,
    'close': closeDate,
  },
  'responding': {
    'open': openDate,
    'close': closeDate,
  },
  'synthesizing': {
    'open': '',
    'close': closeDate,
  }
}

export const synthesizingClosePast = {
  'id': '629a69deaa8494f552c89cd9',
  'open': openDate,
  'close': closeDate,
  'posting': {
    'open': openDate,
    'close': closeDate,
  },
  'responding': {
    'open': openDate,
    'close': closeDate,
  },
  'synthesizing': {
    'open': openDate,
    'close': new Date("2022-01-01"),
  }
}

export const synthesizingCloseNotDate = {
  'id': '629a69deaa8494f552c89cd9',
  'open': openDate,
  'close': closeDate,
  'posting': {
    'open': openDate,
    'close': closeDate,
  },
  'responding': {
    'open': openDate,
    'close': closeDate,
  },
  'synthesizing': {
    'open': openDate,
    'close': 'not a date',
  }
}

export const synthesizingCloseEmpty = {
  'id': '629a69deaa8494f552c89cd9',
  'open': openDate,
  'close': closeDate,
  'posting': {
    'open': openDate,
    'close': closeDate,
  },
  'responding': {
    'open': openDate,
    'close': closeDate,
  },
  'synthesizing': {
    'open': openDate,
    'close': '',
  }
}