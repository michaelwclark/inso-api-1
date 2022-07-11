//MOCK DATA USED FOR TESTING

// CREATE BODY

export const validUser = {
    "username": "TestUser123",
    "f_name": "FirstName",
    "l_name": "LastName",
    "contact": [
      {
        "email": "testing123@gmail.com",
        "verified": false,
        "primary": true
      },
      {
        "email": "testing123@yahoo.com",
        'verified': false,
        'primary': false
      }
    ],
    "sso": [
      "string",
      "s",
      "string"
    ],
    "password": "sgjzkKJD)e9ff",
    "level": "string",
    "subject": "string"
}

export const userNotString = {
  "username": 12345,
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const usernameEmpty = {
  "username": '',
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const userInvalidCharactersAmt = {
  "username": "ThisUsernameIsWayTooLonggggggggggg",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const usernameBadWord = {
  "username": "Asshole",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const usernameEmailAdd = {
  "username": "thisIsAnEmail@gmail.com",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const existingUsername = {
  "username": "NewUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const fnameNotString = {
  "username": "TestUser",
  "f_name": 12345,
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const fnameEmpty = {
  "username": "TestUser",
  "f_name": "",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const lnameNotString = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": 12345,
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const lnameEmpty = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const passwordNotString = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": 12345,
  "level": "string",
  "subject": "string"
}

export const passwordEmpty = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "",
  "level": "string",
  "subject": "string"
}

export const passwordTooShort = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "short",
  "level": "string",
  "subject": "string"
}

export const passwordNoLowercase = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "PASSWORD",
  "level": "string",
  "subject": "string"
}

export const passwordNoUppercase = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "password",
  "level": "string",
  "subject": "string"
}

export const passwordNoNumber = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "passWORD",
  "level": "string",
  "subject": "string"
}

export const passwordNoSpecialChar = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "passWORD123",
  "level": "string",
  "subject": "string"
}

export const contactEmpty = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": '',
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const contactNotArray = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": "contact",
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const contactEmptyArray = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const contactArrayWrongType = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [1, 2, 3, 4, 5],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const contactEmailNotString = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": 12345,
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const contactEmptyEmail = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const contactEmailNotAnEmail = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "thisIsNotAnEmailAddress",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const ssoEmpty = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": "",
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const ssoNotArray = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": "NotAnArray",
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const ssoEmptyArray = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const ssoArrayWrongType = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [1, 2, 3, 4, 5],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const ssoArrayElementsEmpty = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": ["", "", ""],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const levelNotString = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": 12345,
  "subject": "string"
}

export const levelEmpty = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": "",
  "subject": "string"
}

export const subjectNotString = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": 12345
}

export const subjectEmpty = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": ""
}

// EDIT BODY

export const dummy = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const newValidBody = {
  "username": "TestUser",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "differentEmail@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "thisEmailIsFake@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

export const existingUsernamePatch = {
  "username": "TestUser123",
  "f_name": "FirstName",
  "l_name": "LastName",
  "contact": [
    {
      "email": "testing@gmail.com",
      "verified": false,
      "primary": true
    },
    {
      "email": "testing@yahoo.com",
      'verified': false,
      'primary': false
    }
  ],
  "sso": [
    "string",
    "s",
    "string"
  ],
  "password": "sgjzkKJD)e9ff",
  "level": "string",
  "subject": "string"
}

// export const validUser = {
//   "username": "TestUser123",
//   "f_name": "FirstName",
//   "l_name": "LastName",
//   "contact": [
//     {
//       "email": "testing123@gmail.com",
//       "verified": false,
//       "primary": true
//     },
//     {
//       "email": "testing123@yahoo.com",
//       'verified': false,
//       'primary': false
//     }
//   ],
//   "sso": [
//     "string",
//     "s",
//     "string"
//   ],
//   "password": "sgjzkKJD)e9ff",
//   "level": "string",
//   "subject": "string"
// }

// export const userNotString = {
// "username": 12345,
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "sgjzkKJD)e9ff",
// "level": "string",
// "subject": "string"
// }

// export const usernameEmpty = {
// "username": '',
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "sgjzkKJD)e9ff",
// "level": "string",
// "subject": "string"
// }

// export const userInvalidCharactersAmt = {
// "username": "ThisUsernameIsWayTooLonggggggggggg",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "sgjzkKJD)e9ff",
// "level": "string",
// "subject": "string"
// }

// export const usernameBadWord = {
// "username": "Asshole",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "sgjzkKJD)e9ff",
// "level": "string",
// "subject": "string"
// }

// export const usernameEmailAdd = {
// "username": "thisIsAnEmail@gmail.com",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "sgjzkKJD)e9ff",
// "level": "string",
// "subject": "string"
// }

// export const existingUsername = {
// "username": "NewUser",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "sgjzkKJD)e9ff",
// "level": "string",
// "subject": "string"
// }

// export const fnameNotString = {
// "username": "TestUser",
// "f_name": 12345,
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "sgjzkKJD)e9ff",
// "level": "string",
// "subject": "string"
// }

// export const fnameEmpty = {
// "username": "TestUser",
// "f_name": "",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "sgjzkKJD)e9ff",
// "level": "string",
// "subject": "string"
// }

// export const lnameNotString = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": 12345,
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "sgjzkKJD)e9ff",
// "level": "string",
// "subject": "string"
// }

// export const lnameEmpty = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": "",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "sgjzkKJD)e9ff",
// "level": "string",
// "subject": "string"
// }

// export const passwordNotString = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": 12345,
// "level": "string",
// "subject": "string"
// }

// export const passwordEmpty = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "",
// "level": "string",
// "subject": "string"
// }

// export const passwordTooShort = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "short",
// "level": "string",
// "subject": "string"
// }

// export const passwordNoLowercase = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "PASSWORD",
// "level": "string",
// "subject": "string"
// }

// export const passwordNoUppercase = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "password",
// "level": "string",
// "subject": "string"
// }

// export const passwordNoNumber = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "passWORD",
// "level": "string",
// "subject": "string"
// }

// export const passwordNoSpecialChar = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "passWORD123",
// "level": "string",
// "subject": "string"
// }

// export const contactEmpty = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": '',
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "sgjzkKJD)e9ff",
// "level": "string",
// "subject": "string"
// }

// export const contactNotArray = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": "contact",
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "sgjzkKJD)e9ff",
// "level": "string",
// "subject": "string"
// }

// export const contactEmptyArray = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "sgjzkKJD)e9ff",
// "level": "string",
// "subject": "string"
// }

// export const contactArrayWrongType = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [1, 2, 3, 4, 5],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "sgjzkKJD)e9ff",
// "level": "string",
// "subject": "string"
// }

// export const contactEmailNotString = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": 12345,
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "sgjzkKJD)e9ff",
// "level": "string",
// "subject": "string"
// }

// export const contactEmptyEmail = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "sgjzkKJD)e9ff",
// "level": "string",
// "subject": "string"
// }

// export const contactEmailNotAnEmail = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "thisIsNotAnEmailAddress",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "sgjzkKJD)e9ff",
// "level": "string",
// "subject": "string"
// }

// export const ssoEmpty = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": "",
// "password": "sgjzkKJD)e9ff",
// "level": "string",
// "subject": "string"
// }

// export const ssoNotArray = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": "NotAnArray",
// "password": "sgjzkKJD)e9ff",
// "level": "string",
// "subject": "string"
// }

// export const ssoEmptyArray = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [],
// "password": "sgjzkKJD)e9ff",
// "level": "string",
// "subject": "string"
// }

// export const ssoArrayWrongType = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [1, 2, 3, 4, 5],
// "password": "sgjzkKJD)e9ff",
// "level": "string",
// "subject": "string"
// }

// export const ssoArrayElementsEmpty = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": ["", "", ""],
// "password": "sgjzkKJD)e9ff",
// "level": "string",
// "subject": "string"
// }

// export const levelNotString = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "sgjzkKJD)e9ff",
// "level": 12345,
// "subject": "string"
// }

// export const levelEmpty = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "sgjzkKJD)e9ff",
// "level": "",
// "subject": "string"
// }

// export const subjectNotString = {
// "username": "TestUser",
// "f_name": "FirstName",
// "l_name": "LastName",
// "contact": [
//   {
//     "email": "testing@gmail.com",
//     "verified": false,
//     "primary": true
//   },
//   {
//     "email": "testing@yahoo.com",
//     'verified': false,
//     'primary': false
//   }
// ],
// "sso": [
//   "string",
//   "s",
//   "string"
// ],
// "password": "sgjzkKJD)e9ff",
// "level": "string",
// "subject": 12345
// }