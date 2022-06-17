
// MOCK DATA USED FOR TESTING

 var open = new Date("2022-06-20");
 var close = new Date("2022-06-25");

export const validCalendar = {
    'open': open,
    'close': close,
    'posting': {
      'open': open,
      'close': close,
    },
    'responding': {
      'open': open,
      'close': close,
    },
    'synthesizing': {
      'open': open,
      'close': close,
    }
}

export const openDateInPast = {
    'open': new Date("2022-01-01"),
    'close': close,
    'posting': {
      'open': open,
      'close': close,
    },
    'responding': {
      'open': open,
      'close': close,
    },
    'synthesizing': {
      'open': open,
      'close': close,
    }
}

export const openDateNotADate = {
    'open': "not a date",
    'close': close,
    'posting': {
      'open': open,
      'close': close,
    },
    'responding': {
      'open': open,
      'close': close,
    },
    'synthesizing': {
      'open': open,
      'close': close,
    }
}

export const openDateEmpty = {
  'open': "",
  'close': close,
  'posting': {
    'open': open,
    'close': close,
  },
  'responding': {
    'open': open,
    'close': close,
  },
  'synthesizing': {
    'open': open,
    'close': close,
  }
}

export const closeDateInPast = {
  'open': open,
  'close': new Date("2022-01-01"),
  'posting': {
    'open': open,
    'close': close,
  },
  'responding': {
    'open': open,
    'close': close,
  },
  'synthesizing': {
    'open': open,
    'close': close,
  }
}

export const closeDateNotADate = {
  'open': open,
  'close': "not a date",
  'posting': {
    'open': open,
    'close': close,
  },
  'responding': {
    'open': open,
    'close': close,
  },
  'synthesizing': {
    'open': open,
    'close': close,
  }
}

export const closeDateEmpty = {
'open': open,
'close': "",
'posting': {
  'open': open,
  'close': close,
},
'responding': {
  'open': open,
  'close': close,
},
'synthesizing': {
  'open': open,
  'close': close,
}
}

// POSTING ERRORS

export const postingEmpty = {
'open': open,
 'close': close,
  'posting': "",
  'responding': {
    'open': open,
    'close': close,
  },
  'synthesizing': {
    'open': open,
    'close': close,
  }
}

export const postingOpenPast = {
  'open': open,
  'close': close,
  'posting': {
    'open': new Date("2022-01-01"),
    'close': close,
  },
  'responding': {
    'open': open,
    'close': close,
  },
  'synthesizing': {
    'open': open,
    'close': close,
  }
}

export const postingOpenNotDate = {
  'open': open,
  'close': close,
  'posting': {
    'open': "not a date",
    'close': close,
  },
  'responding': {
    'open': open,
    'close': close,
  },
  'synthesizing': {
    'open': open,
    'close': close,
  }
}

export const postingOpenEmpty = {
  'open': open,
  'close': close,
  'posting': {
    'open': "",
    'close': close,
  },
  'responding': {
    'open': open,
    'close': close,
  },
  'synthesizing': {
    'open': open,
    'close': close,
  }
}

export const postingClosePast = {
  'open': open,
  'close': close,
  'posting': {
    'open': open,
    'close': new Date("2022-01-01"),
  },
  'responding': {
    'open': open,
    'close': close,
  },
  'synthesizing': {
    'open': open,
    'close': close,
  }
}

export const postingCloseNotDate = {
  'open': open,
  'close': close,
  'posting': {
    'open': open,
    'close': "not a date",
  },
  'responding': {
    'open': open,
    'close': close,
  },
  'synthesizing': {
    'open': open,
    'close': close,
  }
}

export const postingCloseEmpty = {
  'open': open,
  'close': close,
  'posting': {
    'open': open,
    'close': "",
  },
  'responding': {
    'open': open,
    'close': close,
  },
  'synthesizing': {
    'open': open,
    'close': close,
  }
}

// RESPONDING ERRORS

export const respondingEmpty = {
  'open': open,
  'close': close,
  'posting': {
    'open': open,
    'close': close,
  },
  'responding': "",
  'synthesizing': {
    'open': open,
    'close': close,
  }
}

export const respondingOpenPast = {
  'open': open,
  'close': close,
  'posting': {
    'open': open,
    'close': close,
  },
  'responding': {
    'open': new Date("2022-01-01"),
    'close': close,
  },
  'synthesizing': {
    'open': open,
    'close': close,
  }
}

export const respondingOpenNotDate = {
  'open': open,
  'close': close,
  'posting': {
    'open': open,
    'close': close,
  },
  'responding': {
    'open': 'not a date',
    'close': close,
  },
  'synthesizing': {
    'open': open,
    'close': close,
  }
}

export const respondingOpenEmpty = {
  'open': open,
  'close': close,
  'posting': {
    'open': open,
    'close': close,
  },
  'responding': {
    'open': '',
    'close': close,
  },
  'synthesizing': {
    'open': open,
    'close': close,
  }
}

export const respondingClosePast = {
  'open': open,
  'close': close,
  'posting': {
    'open': open,
    'close': close,
  },
  'responding': {
    'open': open,
    'close': new Date("2022-01-01"),
  },
  'synthesizing': {
    'open': open,
    'close': close,
  }
}

export const respondingCloseNotDate = {
  'open': open,
  'close': close,
  'posting': {
    'open': open,
    'close': close,
  },
  'responding': {
    'open': open,
    'close': 'not a date',
  },
  'synthesizing': {
    'open': open,
    'close': close,
  }
}

export const respondingCloseEmpty = {
  'open': open,
  'close': close,
  'posting': {
    'open': open,
    'close': close,
  },
  'responding': {
    'open': open,
    'close': '',
  },
  'synthesizing': {
    'open': open,
    'close': close,
  }
}

// SYNTHESIZING ERRORS

export const synthesizingEmpty = {
  'open': open,
  'close': close,
  'posting': {
    'open': open,
    'close': close,
  },
  'responding': {
    'open': open,
    'close': close,
  },
  'synthesizing': ''
}

export const synthesizingOpenPast = {
  'open': open,
  'close': close,
  'posting': {
    'open': open,
    'close': close,
  },
  'responding': {
    'open': open,
    'close': close,
  },
  'synthesizing': {
    'open': new Date("2022-01-01"),
    'close': close,
  }
}

export const synthesizingOpenNotDate = {
  'open': open,
  'close': close,
  'posting': {
    'open': open,
    'close': close,
  },
  'responding': {
    'open': open,
    'close': close,
  },
  'synthesizing': {
    'open': 'not a date',
    'close': close,
  }
}

export const synthesizingOpenEmpty = {
  'open': open,
  'close': close,
  'posting': {
    'open': open,
    'close': close,
  },
  'responding': {
    'open': open,
    'close': close,
  },
  'synthesizing': {
    'open': '',
    'close': close,
  }
}

export const synthesizingClosePast = {
  'open': open,
  'close': close,
  'posting': {
    'open': open,
    'close': close,
  },
  'responding': {
    'open': open,
    'close': close,
  },
  'synthesizing': {
    'open': open,
    'close': new Date("2022-01-01"),
  }
}

export const synthesizingCloseNotDate = {
  'open': open,
  'close': close,
  'posting': {
    'open': open,
    'close': close,
  },
  'responding': {
    'open': open,
    'close': close,
  },
  'synthesizing': {
    'open': open,
    'close': 'not a date',
  }
}

export const synthesizingCloseEmpty = {
  'open': open,
  'close': close,
  'posting': {
    'open': open,
    'close': close,
  },
  'responding': {
    'open': open,
    'close': close,
  },
  'synthesizing': {
    'open': open,
    'close': '',
  }
}