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