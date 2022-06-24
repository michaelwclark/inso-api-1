// MOCK DATA USED FOR TESTING

export const validScore = {
    'type': 'rubric',
    'instructions':  {
      'posting': 10,
      'responding': 10,
      'synthesizing': 10
    },
    'interactions': {
      'max': 10
    },
    'impact': {
      'max': 10
    },
    'rubric': {
      'max': 10,
      'criteria': [ {
          'description': 'This is an example',
          'max': 10
      } ]
    }
}

export const typeNotString = {
    'type': 898789,
    'instructions':  {
      'posting': 10,
      'responding': 10,
      'synthesizing': 10
    },
    'interactions': {
      'max': 10
    },
    'impact': {
      'max': 10
    },
    'rubric': {
      'max': 10,
      'criteria': [ {
          'description': 'This is an example',
          'max': 10
      } ]
    }
}

export const typeNull = {
    'type': null,
    'instructions':  {
      'posting': 10,
      'responding': 10,
      'synthesizing': 10
    },
    'interactions': {
      'max': 10
    },
    'impact': {
      'max': 10
    },
    'rubric': {
      'max': 10,
      'criteria': [ {
          'description': 'This is an example',
          'max': 10
      } ]
    }
}

export const instructionsEmpty = {
    'type': 'rubric',
    'instructions':  '',
    'interactions': {
      'max': 10
    },
    'impact': {
      'max': 10
    },
    'rubric': {
      'max': 10,
      'criteria': [ {
          'description': 'This is an example',
          'max': 10
      } ]
    }
}

export const instPostingNotNum = {
    'type': 'rubric',
    'instructions':  {
      'posting': 'This is not a number',
      'responding': 10,
      'synthesizing': 10
    },
    'interactions': {
      'max': 10
    },
    'impact': {
      'max': 10
    },
    'rubric': {
      'max': 10,
      'criteria': [ {
          'description': 'This is an example',
          'max': 10
      } ]
    }
}

export const instPostingEmpty = {
    'type': 'rubric',
    'instructions':  {
      'posting': '',
      'responding': 10,
      'synthesizing': 10
    },
    'interactions': {
      'max': 10
    },
    'impact': {
      'max': 10
    },
    'rubric': {
      'max': 10,
      'criteria': [ {
          'description': 'This is an example',
          'max': 10
      } ]
    }
}

export const instRespondingNotNum = {
    'type': 'rubric',
    'instructions':  {
      'posting': 10,
      'responding': 'This is not a number',
      'synthesizing': 10
    },
    'interactions': {
      'max': 10
    },
    'impact': {
      'max': 10
    },
    'rubric': {
      'max': 10,
      'criteria': [ {
          'description': 'This is an example',
          'max': 10
      } ]
    }
}

export const instRespondingEmpty = {
    'type': 'rubric',
    'instructions':  {
      'posting': 10,
      'responding': '',
      'synthesizing': 10
    },
    'interactions': {
      'max': 10
    },
    'impact': {
      'max': 10
    },
    'rubric': {
      'max': 10,
      'criteria': [ {
          'description': 'This is an example',
          'max': 10
      } ]
    }
}

export const instSynthesizingNotNum = {
    'type': 'rubric',
    'instructions':  {
      'posting': 10,
      'responding': 10,
      'synthesizing': 'This is not a number'
    },
    'interactions': {
      'max': 10
    },
    'impact': {
      'max': 10
    },
    'rubric': {
      'max': 10,
      'criteria': [ {
          'description': 'This is an example',
          'max': 10
      } ]
    }
}

export const instSynthesizingEmpty = {
    'type': 'rubric',
    'instructions':  {
      'posting': 10,
      'responding': 10,
      'synthesizing': ''
    },
    'interactions': {
      'max': 10
    },
    'impact': {
      'max': 10
    },
    'rubric': {
      'max': 10,
      'criteria': [ {
          'description': 'This is an example',
          'max': 10
      } ]
    }
}

export const interactionsEmpty = {
    'type': 'rubric',
    'instructions':  {
      'posting': 10,
      'responding': 10,
      'synthesizing': 10
    },
    'interactions': '',
    'impact': {
      'max': 10
    },
    'rubric': {
      'max': 10,
      'criteria': [ {
          'description': 'This is an example',
          'max': 10
      } ]
    }
}

export const interMaxNotNum = {
    'type': 'rubric',
    'instructions':  {
      'posting': 10,
      'responding': 10,
      'synthesizing': 10
    },
    'interactions': {
      'max': 'This is not a number'
    },
    'impact': {
      'max': 10
    },
    'rubric': {
      'max': 10,
      'criteria': [ {
          'description': 'This is an example',
          'max': 10
      } ]
    }
}

export const interMaxEmpty = {
    'type': 'rubric',
    'instructions':  {
      'posting': 10,
      'responding': 10,
      'synthesizing': 10
    },
    'interactions': {
      'max': ''
    },
    'impact': {
      'max': 10
    },
    'rubric': {
      'max': 10,
      'criteria': [ {
          'description': 'This is an example',
          'max': 10
      } ]
    }
}

export const impactEmpty = {
  'type': 'rubric',
  'instructions':  {
    'posting': 10,
    'responding': 10,
    'synthesizing': 10
  },
  'interactions': {
    'max': '10'
  },
  'impact': '',
  'rubric': {
    'max': 10,
    'criteria': [ {
        'description': 'This is an example',
        'max': 10
    } ]
  }
}

export const impactMaxNotNum = {
  'type': 'rubric',
  'instructions':  {
    'posting': 10,
    'responding': 10,
    'synthesizing': 10
  },
  'interactions': {
    'max': 10
  },
  'impact': {
    'max': 'This is not a number'
  },
  'rubric': {
    'max': 10,
    'criteria': [ {
        'description': 'This is an example',
        'max': 10
    } ]
  }
}

export const impactMaxEmpty = {
  'type': 'rubric',
  'instructions':  {
    'posting': 10,
    'responding': 10,
    'synthesizing': 10
  },
  'interactions': {
    'max': 10
  },
  'impact': {
    'max': ''
  },
  'rubric': {
    'max': 10,
    'criteria': [ {
        'description': 'This is an example',
        'max': 10
    } ]
  }
}

export const rubricEmpty = {
  'type': 'rubric',
  'instructions':  {
    'posting': 10,
    'responding': 10,
    'synthesizing': 10
  },
  'interactions': {
    'max': 10
  },
  'impact': {
    'max': 10
  },
  'rubric': ''
}

export const rubricMaxNotNum = {
  'type': 'rubric',
  'instructions':  {
    'posting': 10,
    'responding': 10,
    'synthesizing': 10
  },
  'interactions': {
    'max': 10
  },
  'impact': {
    'max': 10
  },
  'rubric': {
    'max': 'This is not a number',
    'criteria': [ {
        'description': 'This is an example',
        'max': 10
    } ]
  }
}

export const rubricMaxEmpty = {
  'type': 'rubric',
  'instructions':  {
    'posting': 10,
    'responding': 10,
    'synthesizing': 10
  },
  'interactions': {
    'max': 10
  },
  'impact': {
    'max': 10
  },
  'rubric': {
    'max': '',
    'criteria': [ {
        'description': 'This is an example',
        'max': 10
    } ]
  }
}

export const rubricCriteriaEmpty = {
  'type': 'rubric',
  'instructions':  {
    'posting': 10,
    'responding': 10,
    'synthesizing': 10
  },
  'interactions': {
    'max': 10
  },
  'impact': {
    'max': 10
  },
  'rubric': {
    'max': 10,
    'criteria': ''
  }
}

export const rubricCriteriaEmptyArray = {
  'type': 'rubric',
  'instructions':  {
    'posting': 10,
    'responding': 10,
    'synthesizing': 10
  },
  'interactions': {
    'max': 10
  },
  'impact': {
    'max': 10
  },
  'rubric': {
    'max': 10,
    'criteria': []
  }
}

export const rubricCriteriaArrayWrongType = {
  'type': 'rubric',
  'instructions':  {
    'posting': 10,
    'responding': 10,
    'synthesizing': 10
  },
  'interactions': {
    'max': 10
  },
  'impact': {
    'max': 10
  },
  'rubric': {
    'max': 10,
    'criteria': [ 1, 2, 3, 4, 5 ]
  }
}

export const criteriaDescNotString = {
  'type': 'rubric',
  'instructions':  {
    'posting': 10,
    'responding': 10,
    'synthesizing': 10
  },
  'interactions': {
    'max': 10
  },
  'impact': {
    'max': 10
  },
  'rubric': {
    'max': 10,
    'criteria': [ {
        'description': 344650,
        'max': 10
    } ]
  }
}

export const criteriaDescEmpty = {
  'type': 'rubric',
  'instructions':  {
    'posting': 10,
    'responding': 10,
    'synthesizing': 10
  },
  'interactions': {
    'max': 10
  },
  'impact': {
    'max': 10
  },
  'rubric': {
    'max': 10,
    'criteria': [ {
        'description': '',
        'max': 10
    } ]
  }
}

export const criteriaMaxNotNum = {
  'type': 'rubric',
  'instructions':  {
    'posting': 10,
    'responding': 10,
    'synthesizing': 10
  },
  'interactions': {
    'max': 10
  },
  'impact': {
    'max': 10
  },
  'rubric': {
    'max': 10,
    'criteria': [ {
        'description': 'This is an example',
        'max': 'This is not a number'
    } ]
  }
}

export const criteriaMaxEmpty = {
  'type': 'rubric',
  'instructions':  {
    'posting': 10,
    'responding': 10,
    'synthesizing': 10
  },
  'interactions': {
    'max': 10
  },
  'impact': {
    'max': 10
  },
  'rubric': {
    'max': 10,
    'criteria': [ {
        'description': 'This is an example',
        'max': ''
    } ]
  }
}