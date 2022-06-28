
// MOCK DATA USED FOR TESTING PATCH

import { Types } from "mongoose";

var openDate = new Date("2022-06-25");
var closeDate = new Date("2022-06-30");


export const validCalendar = {
    'id': new Types.ObjectId('629a69deaa8494f552c89cd9'),
    '_id': new Types.ObjectId('629a69deaa8494f552c89cd9'),
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
    },
    'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
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
    },
    'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
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
    },
    'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
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
},
'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const respondingOpenNotDate = {
  'id': new Types.ObjectId('629a69deaa8494f552c89cd9'),
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const respondingOpenEmpty = {
  'id': new Types.ObjectId('629a69deaa8494f552c89cd9'),
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const respondingClosePast = {
  'id': new Types.ObjectId('629a69deaa8494f552c89cd9'),
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const respondingCloseNotDate = {
  'id': new Types.ObjectId('629a69deaa8494f552c89cd9'),
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const respondingCloseEmpty = {
  'id': new Types.ObjectId('629a69deaa8494f552c89cd9'),
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

// SYNTHESIZING ERRORS

export const synthesizingEmpty = {
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
  'synthesizing': '',
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const synthesizingOpenPast = {
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
    'open': new Date("2022-01-01"),
    'close': closeDate,
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const synthesizingOpenNotDate = {
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
    'open': 'not a date',
    'close': closeDate,
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const synthesizingOpenEmpty = {
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
    'open': '',
    'close': closeDate,
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const synthesizingClosePast = {
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
    'close': new Date("2022-01-01"),
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const synthesizingCloseNotDate = {
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
    'close': 'not a date',
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const synthesizingCloseEmpty = {
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
    'close': '',
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}