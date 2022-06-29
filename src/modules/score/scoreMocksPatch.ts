// MOCK DATA USED FOR TESTING PATCH ROUTE

import { Types } from "mongoose"

export const validScoreUpdate = {
    'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
    },
    'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const typeNotStringUpdate = {
    'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
    },
    'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const typeNullUpdate = {
    'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
    },
    'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const instructionsEmptyUpdate = {
    'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
    },
    'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const instPostingNotNumUpdate = {
    'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
    },
    'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const instPostingEmptyUpdate = {
    'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
    },
    'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const instRespondingNotNumUpdate = {
    'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
    },
    'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const instRespondingEmptyUpdate = {
    'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
    },
    'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const instSynthesizingNotNumUpdate = {
    'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
    },
    'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const instSynthesizingEmptyUpdate = {
    'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
    },
    'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const interactionsEmptyUpdate = {
    'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
    },
    'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const interMaxNotNumUpdate = {
    'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
    },
    'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const interMaxEmptyUpdate = {
    'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
    },
    'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const impactEmptyUpdate = {
  'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const impactMaxNotNumUpdate = {
  'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const impactMaxEmptyUpdate = {
  'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const rubricEmptyUpdate = {
  'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
  'rubric': '',
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const rubricMaxNotNumUpdate = {
  'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const rubricMaxEmptyUpdate = {
  'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const rubricCriteriaEmptyUpdate = {
  'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const rubricCriteriaEmptyArrayUpdate = {
  'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const rubricCriteriaArrayWrongTypeUpdate = {
  'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const criteriaDescNotStringUpdate = {
  'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const criteriaDescEmptyUpdate = {
  'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const criteriaMaxNotNumUpdate = {
  'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}

export const criteriaMaxEmptyUpdate = {
  'id': new Types.ObjectId('629a3aaa17d028a1f19f0888'),
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
  },
  'creatorId': new Types.ObjectId('629a3aaa17d028a1f19f0e5c')
}