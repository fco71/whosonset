(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[4213],{

/***/ 113:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  m: () => (/* binding */ formatDistanceToNow)
});

// UNUSED EXPORTS: default

;// ./node_modules/date-fns/constants.js
/**
 * @module constants
 * @summary Useful constants
 * @description
 * Collection of useful date constants.
 *
 * The constants could be imported from `date-fns/constants`:
 *
 * ```ts
 * import { maxTime, minTime } from "./constants/date-fns/constants";
 *
 * function isAllowedTime(time) {
 *   return time <= maxTime && time >= minTime;
 * }
 * ```
 */

/**
 * @constant
 * @name daysInWeek
 * @summary Days in 1 week.
 */
const daysInWeek = 7;

/**
 * @constant
 * @name daysInYear
 * @summary Days in 1 year.
 *
 * @description
 * How many days in a year.
 *
 * One years equals 365.2425 days according to the formula:
 *
 * > Leap year occurs every 4 years, except for years that are divisible by 100 and not divisible by 400.
 * > 1 mean year = (365+1/4-1/100+1/400) days = 365.2425 days
 */
const daysInYear = 365.2425;

/**
 * @constant
 * @name maxTime
 * @summary Maximum allowed time.
 *
 * @example
 * import { maxTime } from "./constants/date-fns/constants";
 *
 * const isValid = 8640000000000001 <= maxTime;
 * //=> false
 *
 * new Date(8640000000000001);
 * //=> Invalid Date
 */
const maxTime = Math.pow(10, 8) * 24 * 60 * 60 * 1000;

/**
 * @constant
 * @name minTime
 * @summary Minimum allowed time.
 *
 * @example
 * import { minTime } from "./constants/date-fns/constants";
 *
 * const isValid = -8640000000000001 >= minTime;
 * //=> false
 *
 * new Date(-8640000000000001)
 * //=> Invalid Date
 */
const minTime = -maxTime;

/**
 * @constant
 * @name millisecondsInWeek
 * @summary Milliseconds in 1 week.
 */
const millisecondsInWeek = 604800000;

/**
 * @constant
 * @name millisecondsInDay
 * @summary Milliseconds in 1 day.
 */
const millisecondsInDay = 86400000;

/**
 * @constant
 * @name millisecondsInMinute
 * @summary Milliseconds in 1 minute
 */
const millisecondsInMinute = 60000;

/**
 * @constant
 * @name millisecondsInHour
 * @summary Milliseconds in 1 hour
 */
const millisecondsInHour = 3600000;

/**
 * @constant
 * @name millisecondsInSecond
 * @summary Milliseconds in 1 second
 */
const millisecondsInSecond = 1000;

/**
 * @constant
 * @name minutesInYear
 * @summary Minutes in 1 year.
 */
const minutesInYear = 525600;

/**
 * @constant
 * @name minutesInMonth
 * @summary Minutes in 1 month.
 */
const minutesInMonth = 43200;

/**
 * @constant
 * @name minutesInDay
 * @summary Minutes in 1 day.
 */
const minutesInDay = 1440;

/**
 * @constant
 * @name minutesInHour
 * @summary Minutes in 1 hour.
 */
const minutesInHour = 60;

/**
 * @constant
 * @name monthsInQuarter
 * @summary Months in 1 quarter.
 */
const monthsInQuarter = 3;

/**
 * @constant
 * @name monthsInYear
 * @summary Months in 1 year.
 */
const monthsInYear = 12;

/**
 * @constant
 * @name quartersInYear
 * @summary Quarters in 1 year
 */
const quartersInYear = 4;

/**
 * @constant
 * @name secondsInHour
 * @summary Seconds in 1 hour.
 */
const secondsInHour = 3600;

/**
 * @constant
 * @name secondsInMinute
 * @summary Seconds in 1 minute.
 */
const secondsInMinute = 60;

/**
 * @constant
 * @name secondsInDay
 * @summary Seconds in 1 day.
 */
const secondsInDay = secondsInHour * 24;

/**
 * @constant
 * @name secondsInWeek
 * @summary Seconds in 1 week.
 */
const secondsInWeek = secondsInDay * 7;

/**
 * @constant
 * @name secondsInYear
 * @summary Seconds in 1 year.
 */
const secondsInYear = secondsInDay * daysInYear;

/**
 * @constant
 * @name secondsInMonth
 * @summary Seconds in 1 month
 */
const secondsInMonth = secondsInYear / 12;

/**
 * @constant
 * @name secondsInQuarter
 * @summary Seconds in 1 quarter.
 */
const secondsInQuarter = secondsInMonth * 3;

/**
 * @constant
 * @name constructFromSymbol
 * @summary Symbol enabling Date extensions to inherit properties from the reference date.
 *
 * The symbol is used to enable the `constructFrom` function to construct a date
 * using a reference date and a value. It allows to transfer extra properties
 * from the reference date to the new date. It's useful for extensions like
 * [`TZDate`](https://github.com/date-fns/tz) that accept a time zone as
 * a constructor argument.
 */
const constructFromSymbol = Symbol.for("constructDateFrom");

;// ./node_modules/date-fns/constructFrom.js


/**
 * @name constructFrom
 * @category Generic Helpers
 * @summary Constructs a date using the reference date and the value
 *
 * @description
 * The function constructs a new date using the constructor from the reference
 * date and the given value. It helps to build generic functions that accept
 * date extensions.
 *
 * It defaults to `Date` if the passed reference date is a number or a string.
 *
 * Starting from v3.7.0, it allows to construct a date using `[Symbol.for("constructDateFrom")]`
 * enabling to transfer extra properties from the reference date to the new date.
 * It's useful for extensions like [`TZDate`](https://github.com/date-fns/tz)
 * that accept a time zone as a constructor argument.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The reference date to take constructor from
 * @param value - The value to create the date
 *
 * @returns Date initialized using the given date and value
 *
 * @example
 * import { constructFrom } from "./constructFrom/date-fns";
 *
 * // A function that clones a date preserving the original type
 * function cloneDate<DateType extends Date>(date: DateType): DateType {
 *   return constructFrom(
 *     date, // Use constructor from the given date
 *     date.getTime() // Use the date value to create a new date
 *   );
 * }
 */
function constructFrom(date, value) {
  if (typeof date === "function") return date(value);

  if (date && typeof date === "object" && constructFromSymbol in date)
    return date[constructFromSymbol](value);

  if (date instanceof Date) return new date.constructor(value);

  return new Date(value);
}

// Fallback for modularized imports:
/* harmony default export */ const date_fns_constructFrom = ((/* unused pure expression or super */ null && (constructFrom)));

;// ./node_modules/date-fns/constructNow.js


/**
 * @name constructNow
 * @category Generic Helpers
 * @summary Constructs a new current date using the passed value constructor.
 * @pure false
 *
 * @description
 * The function constructs a new current date using the constructor from
 * the reference date. It helps to build generic functions that accept date
 * extensions and use the current date.
 *
 * It defaults to `Date` if the passed reference date is a number or a string.
 *
 * @param date - The reference date to take constructor from
 *
 * @returns Current date initialized using the given date constructor
 *
 * @example
 * import { constructNow, isSameDay } from 'date-fns'
 *
 * function isToday<DateType extends Date>(
 *   date: DateArg<DateType>,
 * ): boolean {
 *   // If we were to use `new Date()` directly, the function would  behave
 *   // differently in different timezones and return false for the same date.
 *   return isSameDay(date, constructNow(date));
 * }
 */
function constructNow(date) {
  return constructFrom(date, Date.now());
}

// Fallback for modularized imports:
/* harmony default export */ const date_fns_constructNow = ((/* unused pure expression or super */ null && (constructNow)));

;// ./node_modules/date-fns/locale/en-US/_lib/formatDistance.js
const formatDistanceLocale = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds",
  },

  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds",
  },

  halfAMinute: "half a minute",

  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes",
  },

  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes",
  },

  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours",
  },

  xHours: {
    one: "1 hour",
    other: "{{count}} hours",
  },

  xDays: {
    one: "1 day",
    other: "{{count}} days",
  },

  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks",
  },

  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks",
  },

  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months",
  },

  xMonths: {
    one: "1 month",
    other: "{{count}} months",
  },

  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years",
  },

  xYears: {
    one: "1 year",
    other: "{{count}} years",
  },

  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years",
  },

  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years",
  },
};

const formatDistance = (token, count, options) => {
  let result;

  const tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === "string") {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace("{{count}}", count.toString());
  }

  if (options?.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "in " + result;
    } else {
      return result + " ago";
    }
  }

  return result;
};

;// ./node_modules/date-fns/locale/_lib/buildFormatLongFn.js
function buildFormatLongFn(args) {
  return (options = {}) => {
    // TODO: Remove String()
    const width = options.width ? String(options.width) : args.defaultWidth;
    const format = args.formats[width] || args.formats[args.defaultWidth];
    return format;
  };
}

;// ./node_modules/date-fns/locale/en-US/_lib/formatLong.js


const dateFormats = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy",
};

const timeFormats = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a",
};

const dateTimeFormats = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}",
};

const formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: "full",
  }),

  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: "full",
  }),

  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: "full",
  }),
};

;// ./node_modules/date-fns/locale/en-US/_lib/formatRelative.js
const formatRelativeLocale = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P",
};

const formatRelative = (token, _date, _baseDate, _options) =>
  formatRelativeLocale[token];

;// ./node_modules/date-fns/locale/_lib/buildLocalizeFn.js
/**
 * The localize function argument callback which allows to convert raw value to
 * the actual type.
 *
 * @param value - The value to convert
 *
 * @returns The converted value
 */

/**
 * The map of localized values for each width.
 */

/**
 * The index type of the locale unit value. It types conversion of units of
 * values that don't start at 0 (i.e. quarters).
 */

/**
 * Converts the unit value to the tuple of values.
 */

/**
 * The tuple of localized era values. The first element represents BC,
 * the second element represents AD.
 */

/**
 * The tuple of localized quarter values. The first element represents Q1.
 */

/**
 * The tuple of localized day values. The first element represents Sunday.
 */

/**
 * The tuple of localized month values. The first element represents January.
 */

function buildLocalizeFn(args) {
  return (value, options) => {
    const context = options?.context ? String(options.context) : "standalone";

    let valuesArray;
    if (context === "formatting" && args.formattingValues) {
      const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      const width = options?.width ? String(options.width) : defaultWidth;

      valuesArray =
        args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      const defaultWidth = args.defaultWidth;
      const width = options?.width ? String(options.width) : args.defaultWidth;

      valuesArray = args.values[width] || args.values[defaultWidth];
    }
    const index = args.argumentCallback ? args.argumentCallback(value) : value;

    // @ts-expect-error - For some reason TypeScript just don't want to match it, no matter how hard we try. I challenge you to try to remove it!
    return valuesArray[index];
  };
}

;// ./node_modules/date-fns/locale/en-US/_lib/localize.js


const eraValues = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"],
};

const quarterValues = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"],
};

// Note: in English, the names of days of the week and months are capitalized.
// If you are making a new locale based on this one, check if the same is true for the language you're working on.
// Generally, formatted dates should look like they are in the middle of a sentence,
// e.g. in Spanish language the weekdays and months should be in the lowercase.
const monthValues = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],

  wide: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

const dayValues = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
};

const dayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night",
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night",
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night",
  },
};

const formattingDayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night",
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night",
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night",
  },
};

const ordinalNumber = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);

  // If ordinal numbers depend on context, for example,
  // if they are different for different grammatical genders,
  // use `options.unit`.
  //
  // `unit` can be 'year', 'quarter', 'month', 'week', 'date', 'dayOfYear',
  // 'day', 'hour', 'minute', 'second'.

  const rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
    }
  }
  return number + "th";
};

const localize = {
  ordinalNumber,

  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: "wide",
  }),

  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1,
  }),

  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: "wide",
  }),

  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: "wide",
  }),

  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: "wide",
  }),
};

;// ./node_modules/date-fns/locale/_lib/buildMatchFn.js
function buildMatchFn(args) {
  return (string, options = {}) => {
    const width = options.width;

    const matchPattern =
      (width && args.matchPatterns[width]) ||
      args.matchPatterns[args.defaultMatchWidth];
    const matchResult = string.match(matchPattern);

    if (!matchResult) {
      return null;
    }
    const matchedString = matchResult[0];

    const parsePatterns =
      (width && args.parsePatterns[width]) ||
      args.parsePatterns[args.defaultParseWidth];

    const key = Array.isArray(parsePatterns)
      ? findIndex(parsePatterns, (pattern) => pattern.test(matchedString))
      : // [TODO] -- I challenge you to fix the type
        findKey(parsePatterns, (pattern) => pattern.test(matchedString));

    let value;

    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback
      ? // [TODO] -- I challenge you to fix the type
        options.valueCallback(value)
      : value;

    const rest = string.slice(matchedString.length);

    return { value, rest };
  };
}

function findKey(object, predicate) {
  for (const key in object) {
    if (
      Object.prototype.hasOwnProperty.call(object, key) &&
      predicate(object[key])
    ) {
      return key;
    }
  }
  return undefined;
}

function findIndex(array, predicate) {
  for (let key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return undefined;
}

;// ./node_modules/date-fns/locale/_lib/buildMatchPatternFn.js
function buildMatchPatternFn(args) {
  return (string, options = {}) => {
    const matchResult = string.match(args.matchPattern);
    if (!matchResult) return null;
    const matchedString = matchResult[0];

    const parseResult = string.match(args.parsePattern);
    if (!parseResult) return null;
    let value = args.valueCallback
      ? args.valueCallback(parseResult[0])
      : parseResult[0];

    // [TODO] I challenge you to fix the type
    value = options.valueCallback ? options.valueCallback(value) : value;

    const rest = string.slice(matchedString.length);

    return { value, rest };
  };
}

;// ./node_modules/date-fns/locale/en-US/_lib/match.js



const matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
const parseOrdinalNumberPattern = /\d+/i;

const matchEraPatterns = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i,
};
const parseEraPatterns = {
  any: [/^b/i, /^(a|c)/i],
};

const matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i,
};
const parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i],
};

const matchMonthPatterns = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i,
};
const parseMonthPatterns = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i,
  ],

  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i,
  ],
};

const matchDayPatterns = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i,
};
const parseDayPatterns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i],
};

const matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i,
};
const parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i,
  },
};

const match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: (value) => parseInt(value, 10),
  }),

  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns,
    defaultParseWidth: "any",
  }),

  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1,
  }),

  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: "any",
  }),

  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns,
    defaultParseWidth: "any",
  }),

  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: "any",
  }),
};

;// ./node_modules/date-fns/locale/en-US.js






/**
 * @category Locales
 * @summary English locale (United States).
 * @language English
 * @iso-639-2 eng
 * @author Sasha Koss [@kossnocorp](https://github.com/kossnocorp)
 * @author Lesha Koss [@leshakoss](https://github.com/leshakoss)
 */
const enUS = {
  code: "en-US",
  formatDistance: formatDistance,
  formatLong: formatLong,
  formatRelative: formatRelative,
  localize: localize,
  match: match,
  options: {
    weekStartsOn: 0 /* Sunday */,
    firstWeekContainsDate: 1,
  },
};

// Fallback for modularized imports:
/* harmony default export */ const en_US = ((/* unused pure expression or super */ null && (enUS)));

;// ./node_modules/date-fns/_lib/defaultOptions.js
let defaultOptions = {};

function getDefaultOptions() {
  return defaultOptions;
}

function setDefaultOptions(newOptions) {
  defaultOptions = newOptions;
}

;// ./node_modules/date-fns/toDate.js


/**
 * @name toDate
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Date.
 *
 * @description
 * Convert the given argument to an instance of Date.
 *
 * If the argument is an instance of Date, the function returns its clone.
 *
 * If the argument is a number, it is treated as a timestamp.
 *
 * If the argument is none of the above, the function returns Invalid Date.
 *
 * Starting from v3.7.0, it clones a date using `[Symbol.for("constructDateFrom")]`
 * enabling to transfer extra properties from the reference date to the new date.
 * It's useful for extensions like [`TZDate`](https://github.com/date-fns/tz)
 * that accept a time zone as a constructor argument.
 *
 * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
 *
 * @param argument - The value to convert
 *
 * @returns The parsed date in the local time zone
 *
 * @example
 * // Clone the date:
 * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert the timestamp to date:
 * const result = toDate(1392098430000)
 * //=> Tue Feb 11 2014 11:30:30
 */
function toDate(argument, context) {
  // [TODO] Get rid of `toDate` or `constructFrom`?
  return constructFrom(context || argument, argument);
}

// Fallback for modularized imports:
/* harmony default export */ const date_fns_toDate = ((/* unused pure expression or super */ null && (toDate)));

;// ./node_modules/date-fns/_lib/getTimezoneOffsetInMilliseconds.js


/**
 * Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
 * They usually appear for dates that denote time before the timezones were introduced
 * (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
 * and GMT+01:00:00 after that date)
 *
 * Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
 * which would lead to incorrect calculations.
 *
 * This function returns the timezone offset in milliseconds that takes seconds in account.
 */
function getTimezoneOffsetInMilliseconds(date) {
  const _date = toDate(date);
  const utcDate = new Date(
    Date.UTC(
      _date.getFullYear(),
      _date.getMonth(),
      _date.getDate(),
      _date.getHours(),
      _date.getMinutes(),
      _date.getSeconds(),
      _date.getMilliseconds(),
    ),
  );
  utcDate.setUTCFullYear(_date.getFullYear());
  return +date - +utcDate;
}

;// ./node_modules/date-fns/_lib/normalizeDates.js


function normalizeDates(context, ...dates) {
  const normalize = constructFrom.bind(
    null,
    context || dates.find((date) => typeof date === "object"),
  );
  return dates.map(normalize);
}

;// ./node_modules/date-fns/compareAsc.js


/**
 * @name compareAsc
 * @category Common Helpers
 * @summary Compare the two dates and return -1, 0 or 1.
 *
 * @description
 * Compare the two dates and return 1 if the first date is after the second,
 * -1 if the first date is before the second or 0 if dates are equal.
 *
 * @param dateLeft - The first date to compare
 * @param dateRight - The second date to compare
 *
 * @returns The result of the comparison
 *
 * @example
 * // Compare 11 February 1987 and 10 July 1989:
 * const result = compareAsc(new Date(1987, 1, 11), new Date(1989, 6, 10))
 * //=> -1
 *
 * @example
 * // Sort the array of dates:
 * const result = [
 *   new Date(1995, 6, 2),
 *   new Date(1987, 1, 11),
 *   new Date(1989, 6, 10)
 * ].sort(compareAsc)
 * //=> [
 * //   Wed Feb 11 1987 00:00:00,
 * //   Mon Jul 10 1989 00:00:00,
 * //   Sun Jul 02 1995 00:00:00
 * // ]
 */
function compareAsc(dateLeft, dateRight) {
  const diff = +toDate(dateLeft) - +toDate(dateRight);

  if (diff < 0) return -1;
  else if (diff > 0) return 1;

  // Return 0 if diff is 0; return NaN if diff is NaN
  return diff;
}

// Fallback for modularized imports:
/* harmony default export */ const date_fns_compareAsc = ((/* unused pure expression or super */ null && (compareAsc)));

;// ./node_modules/date-fns/differenceInCalendarMonths.js


/**
 * The {@link differenceInCalendarMonths} function options.
 */

/**
 * @name differenceInCalendarMonths
 * @category Month Helpers
 * @summary Get the number of calendar months between the given dates.
 *
 * @description
 * Get the number of calendar months between the given dates.
 *
 * @param laterDate - The later date
 * @param earlierDate - The earlier date
 * @param options - An object with options
 *
 * @returns The number of calendar months
 *
 * @example
 * // How many calendar months are between 31 January 2014 and 1 September 2014?
 * const result = differenceInCalendarMonths(
 *   new Date(2014, 8, 1),
 *   new Date(2014, 0, 31)
 * )
 * //=> 8
 */
function differenceInCalendarMonths(laterDate, earlierDate, options) {
  const [laterDate_, earlierDate_] = normalizeDates(
    options?.in,
    laterDate,
    earlierDate,
  );

  const yearsDiff = laterDate_.getFullYear() - earlierDate_.getFullYear();
  const monthsDiff = laterDate_.getMonth() - earlierDate_.getMonth();

  return yearsDiff * 12 + monthsDiff;
}

// Fallback for modularized imports:
/* harmony default export */ const date_fns_differenceInCalendarMonths = ((/* unused pure expression or super */ null && (differenceInCalendarMonths)));

;// ./node_modules/date-fns/endOfDay.js


/**
 * The {@link endOfDay} function options.
 */

/**
 * @name endOfDay
 * @category Day Helpers
 * @summary Return the end of a day for the given date.
 *
 * @description
 * Return the end of a day for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
 *
 * @param date - The original date
 * @param options - An object with options
 *
 * @returns The end of a day
 *
 * @example
 * // The end of a day for 2 September 2014 11:55:00:
 * const result = endOfDay(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 02 2014 23:59:59.999
 */
function endOfDay(date, options) {
  const _date = toDate(date, options?.in);
  _date.setHours(23, 59, 59, 999);
  return _date;
}

// Fallback for modularized imports:
/* harmony default export */ const date_fns_endOfDay = ((/* unused pure expression or super */ null && (endOfDay)));

;// ./node_modules/date-fns/endOfMonth.js


/**
 * The {@link endOfMonth} function options.
 */

/**
 * @name endOfMonth
 * @category Month Helpers
 * @summary Return the end of a month for the given date.
 *
 * @description
 * Return the end of a month for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 * @typeParam ResultDate - The result `Date` type, it is the type returned from the context function if it is passed, or inferred from the arguments.
 *
 * @param date - The original date
 * @param options - An object with options
 *
 * @returns The end of a month
 *
 * @example
 * // The end of a month for 2 September 2014 11:55:00:
 * const result = endOfMonth(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 30 2014 23:59:59.999
 */
function endOfMonth(date, options) {
  const _date = toDate(date, options?.in);
  const month = _date.getMonth();
  _date.setFullYear(_date.getFullYear(), month + 1, 0);
  _date.setHours(23, 59, 59, 999);
  return _date;
}

// Fallback for modularized imports:
/* harmony default export */ const date_fns_endOfMonth = ((/* unused pure expression or super */ null && (endOfMonth)));

;// ./node_modules/date-fns/isLastDayOfMonth.js




/**
 * @name isLastDayOfMonth
 * @category Month Helpers
 * @summary Is the given date the last day of a month?
 *
 * @description
 * Is the given date the last day of a month?
 *
 * @param date - The date to check
 * @param options - An object with options
 *
 * @returns The date is the last day of a month
 *
 * @example
 * // Is 28 February 2014 the last day of a month?
 * const result = isLastDayOfMonth(new Date(2014, 1, 28))
 * //=> true
 */
function isLastDayOfMonth(date, options) {
  const _date = toDate(date, options?.in);
  return +endOfDay(_date, options) === +endOfMonth(_date, options);
}

// Fallback for modularized imports:
/* harmony default export */ const date_fns_isLastDayOfMonth = ((/* unused pure expression or super */ null && (isLastDayOfMonth)));

;// ./node_modules/date-fns/differenceInMonths.js





/**
 * The {@link differenceInMonths} function options.
 */

/**
 * @name differenceInMonths
 * @category Month Helpers
 * @summary Get the number of full months between the given dates.
 *
 * @param laterDate - The later date
 * @param earlierDate - The earlier date
 * @param options - An object with options
 *
 * @returns The number of full months
 *
 * @example
 * // How many full months are between 31 January 2014 and 1 September 2014?
 * const result = differenceInMonths(new Date(2014, 8, 1), new Date(2014, 0, 31))
 * //=> 7
 */
function differenceInMonths(laterDate, earlierDate, options) {
  const [laterDate_, workingLaterDate, earlierDate_] = normalizeDates(
    options?.in,
    laterDate,
    laterDate,
    earlierDate,
  );

  const sign = compareAsc(workingLaterDate, earlierDate_);
  const difference = Math.abs(
    differenceInCalendarMonths(workingLaterDate, earlierDate_),
  );

  if (difference < 1) return 0;

  if (workingLaterDate.getMonth() === 1 && workingLaterDate.getDate() > 27)
    workingLaterDate.setDate(30);

  workingLaterDate.setMonth(workingLaterDate.getMonth() - sign * difference);

  let isLastMonthNotFull = compareAsc(workingLaterDate, earlierDate_) === -sign;

  if (
    isLastDayOfMonth(laterDate_) &&
    difference === 1 &&
    compareAsc(laterDate_, earlierDate_) === 1
  ) {
    isLastMonthNotFull = false;
  }

  const result = sign * (difference - +isLastMonthNotFull);
  return result === 0 ? 0 : result;
}

// Fallback for modularized imports:
/* harmony default export */ const date_fns_differenceInMonths = ((/* unused pure expression or super */ null && (differenceInMonths)));

;// ./node_modules/date-fns/_lib/getRoundingMethod.js
function getRoundingMethod(method) {
  return (number) => {
    const round = method ? Math[method] : Math.trunc;
    const result = round(number);
    // Prevent negative zero
    return result === 0 ? 0 : result;
  };
}

;// ./node_modules/date-fns/differenceInMilliseconds.js


/**
 * @name differenceInMilliseconds
 * @category Millisecond Helpers
 * @summary Get the number of milliseconds between the given dates.
 *
 * @description
 * Get the number of milliseconds between the given dates.
 *
 * @param laterDate - The later date
 * @param earlierDate - The earlier date
 *
 * @returns The number of milliseconds
 *
 * @example
 * // How many milliseconds are between
 * // 2 July 2014 12:30:20.600 and 2 July 2014 12:30:21.700?
 * const result = differenceInMilliseconds(
 *   new Date(2014, 6, 2, 12, 30, 21, 700),
 *   new Date(2014, 6, 2, 12, 30, 20, 600)
 * )
 * //=> 1100
 */
function differenceInMilliseconds(laterDate, earlierDate) {
  return +toDate(laterDate) - +toDate(earlierDate);
}

// Fallback for modularized imports:
/* harmony default export */ const date_fns_differenceInMilliseconds = ((/* unused pure expression or super */ null && (differenceInMilliseconds)));

;// ./node_modules/date-fns/differenceInSeconds.js



/**
 * The {@link differenceInSeconds} function options.
 */

/**
 * @name differenceInSeconds
 * @category Second Helpers
 * @summary Get the number of seconds between the given dates.
 *
 * @description
 * Get the number of seconds between the given dates.
 *
 * @param laterDate - The later date
 * @param earlierDate - The earlier date
 * @param options - An object with options.
 *
 * @returns The number of seconds
 *
 * @example
 * // How many seconds are between
 * // 2 July 2014 12:30:07.999 and 2 July 2014 12:30:20.000?
 * const result = differenceInSeconds(
 *   new Date(2014, 6, 2, 12, 30, 20, 0),
 *   new Date(2014, 6, 2, 12, 30, 7, 999)
 * )
 * //=> 12
 */
function differenceInSeconds(laterDate, earlierDate, options) {
  const diff = differenceInMilliseconds(laterDate, earlierDate) / 1000;
  return getRoundingMethod(options?.roundingMethod)(diff);
}

// Fallback for modularized imports:
/* harmony default export */ const date_fns_differenceInSeconds = ((/* unused pure expression or super */ null && (differenceInSeconds)));

;// ./node_modules/date-fns/formatDistance.js









/**
 * The {@link formatDistance} function options.
 */

/**
 * @name formatDistance
 * @category Common Helpers
 * @summary Return the distance between the given dates in words.
 *
 * @description
 * Return the distance between the given dates in words.
 *
 * | Distance between dates                                            | Result              |
 * |-------------------------------------------------------------------|---------------------|
 * | 0 ... 30 secs                                                     | less than a minute  |
 * | 30 secs ... 1 min 30 secs                                         | 1 minute            |
 * | 1 min 30 secs ... 44 mins 30 secs                                 | [2..44] minutes     |
 * | 44 mins ... 30 secs ... 89 mins 30 secs                           | about 1 hour        |
 * | 89 mins 30 secs ... 23 hrs 59 mins 30 secs                        | about [2..24] hours |
 * | 23 hrs 59 mins 30 secs ... 41 hrs 59 mins 30 secs                 | 1 day               |
 * | 41 hrs 59 mins 30 secs ... 29 days 23 hrs 59 mins 30 secs         | [2..30] days        |
 * | 29 days 23 hrs 59 mins 30 secs ... 44 days 23 hrs 59 mins 30 secs | about 1 month       |
 * | 44 days 23 hrs 59 mins 30 secs ... 59 days 23 hrs 59 mins 30 secs | about 2 months      |
 * | 59 days 23 hrs 59 mins 30 secs ... 1 yr                           | [2..12] months      |
 * | 1 yr ... 1 yr 3 months                                            | about 1 year        |
 * | 1 yr 3 months ... 1 yr 9 month s                                  | over 1 year         |
 * | 1 yr 9 months ... 2 yrs                                           | almost 2 years      |
 * | N yrs ... N yrs 3 months                                          | about N years       |
 * | N yrs 3 months ... N yrs 9 months                                 | over N years        |
 * | N yrs 9 months ... N+1 yrs                                        | almost N+1 years    |
 *
 * With `options.includeSeconds == true`:
 * | Distance between dates | Result               |
 * |------------------------|----------------------|
 * | 0 secs ... 5 secs      | less than 5 seconds  |
 * | 5 secs ... 10 secs     | less than 10 seconds |
 * | 10 secs ... 20 secs    | less than 20 seconds |
 * | 20 secs ... 40 secs    | half a minute        |
 * | 40 secs ... 60 secs    | less than a minute   |
 * | 60 secs ... 90 secs    | 1 minute             |
 *
 * @param laterDate - The date
 * @param earlierDate - The date to compare with
 * @param options - An object with options
 *
 * @returns The distance in words
 *
 * @throws `date` must not be Invalid Date
 * @throws `baseDate` must not be Invalid Date
 * @throws `options.locale` must contain `formatDistance` property
 *
 * @example
 * // What is the distance between 2 July 2014 and 1 January 2015?
 * const result = formatDistance(new Date(2014, 6, 2), new Date(2015, 0, 1))
 * //=> '6 months'
 *
 * @example
 * // What is the distance between 1 January 2015 00:00:15
 * // and 1 January 2015 00:00:00, including seconds?
 * const result = formatDistance(
 *   new Date(2015, 0, 1, 0, 0, 15),
 *   new Date(2015, 0, 1, 0, 0, 0),
 *   { includeSeconds: true }
 * )
 * //=> 'less than 20 seconds'
 *
 * @example
 * // What is the distance from 1 January 2016
 * // to 1 January 2015, with a suffix?
 * const result = formatDistance(new Date(2015, 0, 1), new Date(2016, 0, 1), {
 *   addSuffix: true
 * })
 * //=> 'about 1 year ago'
 *
 * @example
 * // What is the distance between 1 August 2016 and 1 January 2015 in Esperanto?
 * import { eoLocale } from 'date-fns/locale/eo'
 * const result = formatDistance(new Date(2016, 7, 1), new Date(2015, 0, 1), {
 *   locale: eoLocale
 * })
 * //=> 'pli ol 1 jaro'
 */
function formatDistance_formatDistance(laterDate, earlierDate, options) {
  const defaultOptions = getDefaultOptions();
  const locale = options?.locale ?? defaultOptions.locale ?? enUS;
  const minutesInAlmostTwoDays = 2520;

  const comparison = compareAsc(laterDate, earlierDate);

  if (isNaN(comparison)) throw new RangeError("Invalid time value");

  const localizeOptions = Object.assign({}, options, {
    addSuffix: options?.addSuffix,
    comparison: comparison,
  });

  const [laterDate_, earlierDate_] = normalizeDates(
    options?.in,
    ...(comparison > 0 ? [earlierDate, laterDate] : [laterDate, earlierDate]),
  );

  const seconds = differenceInSeconds(earlierDate_, laterDate_);
  const offsetInSeconds =
    (getTimezoneOffsetInMilliseconds(earlierDate_) -
      getTimezoneOffsetInMilliseconds(laterDate_)) /
    1000;
  const minutes = Math.round((seconds - offsetInSeconds) / 60);
  let months;

  // 0 up to 2 mins
  if (minutes < 2) {
    if (options?.includeSeconds) {
      if (seconds < 5) {
        return locale.formatDistance("lessThanXSeconds", 5, localizeOptions);
      } else if (seconds < 10) {
        return locale.formatDistance("lessThanXSeconds", 10, localizeOptions);
      } else if (seconds < 20) {
        return locale.formatDistance("lessThanXSeconds", 20, localizeOptions);
      } else if (seconds < 40) {
        return locale.formatDistance("halfAMinute", 0, localizeOptions);
      } else if (seconds < 60) {
        return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
      } else {
        return locale.formatDistance("xMinutes", 1, localizeOptions);
      }
    } else {
      if (minutes === 0) {
        return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
      } else {
        return locale.formatDistance("xMinutes", minutes, localizeOptions);
      }
    }

    // 2 mins up to 0.75 hrs
  } else if (minutes < 45) {
    return locale.formatDistance("xMinutes", minutes, localizeOptions);

    // 0.75 hrs up to 1.5 hrs
  } else if (minutes < 90) {
    return locale.formatDistance("aboutXHours", 1, localizeOptions);

    // 1.5 hrs up to 24 hrs
  } else if (minutes < minutesInDay) {
    const hours = Math.round(minutes / 60);
    return locale.formatDistance("aboutXHours", hours, localizeOptions);

    // 1 day up to 1.75 days
  } else if (minutes < minutesInAlmostTwoDays) {
    return locale.formatDistance("xDays", 1, localizeOptions);

    // 1.75 days up to 30 days
  } else if (minutes < minutesInMonth) {
    const days = Math.round(minutes / minutesInDay);
    return locale.formatDistance("xDays", days, localizeOptions);

    // 1 month up to 2 months
  } else if (minutes < minutesInMonth * 2) {
    months = Math.round(minutes / minutesInMonth);
    return locale.formatDistance("aboutXMonths", months, localizeOptions);
  }

  months = differenceInMonths(earlierDate_, laterDate_);

  // 2 months up to 12 months
  if (months < 12) {
    const nearestMonth = Math.round(minutes / minutesInMonth);
    return locale.formatDistance("xMonths", nearestMonth, localizeOptions);

    // 1 year up to max Date
  } else {
    const monthsSinceStartOfYear = months % 12;
    const years = Math.trunc(months / 12);

    // N years up to 1 years 3 months
    if (monthsSinceStartOfYear < 3) {
      return locale.formatDistance("aboutXYears", years, localizeOptions);

      // N years 3 months up to N years 9 months
    } else if (monthsSinceStartOfYear < 9) {
      return locale.formatDistance("overXYears", years, localizeOptions);

      // N years 9 months up to N year 12 months
    } else {
      return locale.formatDistance("almostXYears", years + 1, localizeOptions);
    }
  }
}

// Fallback for modularized imports:
/* harmony default export */ const date_fns_formatDistance = ((/* unused pure expression or super */ null && (formatDistance_formatDistance)));

;// ./node_modules/date-fns/formatDistanceToNow.js




/**
 * The {@link formatDistanceToNow} function options.
 */

/**
 * @name formatDistanceToNow
 * @category Common Helpers
 * @summary Return the distance between the given date and now in words.
 * @pure false
 *
 * @description
 * Return the distance between the given date and now in words.
 *
 * | Distance to now                                                   | Result              |
 * |-------------------------------------------------------------------|---------------------|
 * | 0 ... 30 secs                                                     | less than a minute  |
 * | 30 secs ... 1 min 30 secs                                         | 1 minute            |
 * | 1 min 30 secs ... 44 mins 30 secs                                 | [2..44] minutes     |
 * | 44 mins ... 30 secs ... 89 mins 30 secs                           | about 1 hour        |
 * | 89 mins 30 secs ... 23 hrs 59 mins 30 secs                        | about [2..24] hours |
 * | 23 hrs 59 mins 30 secs ... 41 hrs 59 mins 30 secs                 | 1 day               |
 * | 41 hrs 59 mins 30 secs ... 29 days 23 hrs 59 mins 30 secs         | [2..30] days        |
 * | 29 days 23 hrs 59 mins 30 secs ... 44 days 23 hrs 59 mins 30 secs | about 1 month       |
 * | 44 days 23 hrs 59 mins 30 secs ... 59 days 23 hrs 59 mins 30 secs | about 2 months      |
 * | 59 days 23 hrs 59 mins 30 secs ... 1 yr                           | [2..12] months      |
 * | 1 yr ... 1 yr 3 months                                            | about 1 year        |
 * | 1 yr 3 months ... 1 yr 9 month s                                  | over 1 year         |
 * | 1 yr 9 months ... 2 yrs                                           | almost 2 years      |
 * | N yrs ... N yrs 3 months                                          | about N years       |
 * | N yrs 3 months ... N yrs 9 months                                 | over N years        |
 * | N yrs 9 months ... N+1 yrs                                        | almost N+1 years    |
 *
 * With `options.includeSeconds == true`:
 * | Distance to now     | Result               |
 * |---------------------|----------------------|
 * | 0 secs ... 5 secs   | less than 5 seconds  |
 * | 5 secs ... 10 secs  | less than 10 seconds |
 * | 10 secs ... 20 secs | less than 20 seconds |
 * | 20 secs ... 40 secs | half a minute        |
 * | 40 secs ... 60 secs | less than a minute   |
 * | 60 secs ... 90 secs | 1 minute             |
 *
 * @param date - The given date
 * @param options - The object with options
 *
 * @returns The distance in words
 *
 * @throws `date` must not be Invalid Date
 * @throws `options.locale` must contain `formatDistance` property
 *
 * @example
 * // If today is 1 January 2015, what is the distance to 2 July 2014?
 * const result = formatDistanceToNow(
 *   new Date(2014, 6, 2)
 * )
 * //=> '6 months'
 *
 * @example
 * // If now is 1 January 2015 00:00:00,
 * // what is the distance to 1 January 2015 00:00:15, including seconds?
 * const result = formatDistanceToNow(
 *   new Date(2015, 0, 1, 0, 0, 15),
 *   {includeSeconds: true}
 * )
 * //=> 'less than 20 seconds'
 *
 * @example
 * // If today is 1 January 2015,
 * // what is the distance to 1 January 2016, with a suffix?
 * const result = formatDistanceToNow(
 *   new Date(2016, 0, 1),
 *   {addSuffix: true}
 * )
 * //=> 'in about 1 year'
 *
 * @example
 * // If today is 1 January 2015,
 * // what is the distance to 1 August 2016 in Esperanto?
 * const eoLocale = require('date-fns/locale/eo')
 * const result = formatDistanceToNow(
 *   new Date(2016, 7, 1),
 *   {locale: eoLocale}
 * )
 * //=> 'pli ol 1 jaro'
 */
function formatDistanceToNow(date, options) {
  return formatDistance_formatDistance(date, constructNow(date), options);
}

// Fallback for modularized imports:
/* harmony default export */ const date_fns_formatDistanceToNow = ((/* unused pure expression or super */ null && (formatDistanceToNow)));


/***/ }),

/***/ 304:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "69e09a587b911ec8ad0f.woff";

/***/ }),

/***/ 330:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "397037a7cc1ed6f3012e.woff";

/***/ }),

/***/ 422:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5072);
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7825);
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7659);
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5056);
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(540);
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1113);
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_500_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6743);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_500_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A, options);




       /* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_500_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A && _css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_500_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A.locals ? _css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_500_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A.locals : undefined);


/***/ }),

/***/ 540:
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ 679:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "084676038be5b1c38324.woff2";

/***/ }),

/***/ 888:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  l$: () => (/* binding */ Oe),
  Ay: () => (/* binding */ Vt),
  oR: () => (/* binding */ dist_c)
});

// UNUSED EXPORTS: CheckmarkIcon, ErrorIcon, LoaderIcon, ToastBar, ToastIcon, resolveValue, useToaster, useToasterStore

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
;// ./node_modules/goober/dist/goober.modern.js
let e={data:""},t=t=>"object"==typeof window?((t?t.querySelector("#_goober"):window._goober)||Object.assign((t||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:t||e,r=e=>{let r=t(e),l=r.data;return r.data="",l},l=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,a=/\/\*[^]*?\*\/|  +/g,n=/\n+/g,o=(e,t)=>{let r="",l="",a="";for(let n in e){let c=e[n];"@"==n[0]?"i"==n[1]?r=n+" "+c+";":l+="f"==n[1]?o(c,n):n+"{"+o(c,"k"==n[1]?"":t)+"}":"object"==typeof c?l+=o(c,t?t.replace(/([^,])+/g,e=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):n):null!=c&&(n=/^--/.test(n)?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=o.p?o.p(n,c):n+":"+c+";")}return r+(t&&a?t+"{"+a+"}":a)+l},c={},s=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+s(e[r]);return t}return e},i=(e,t,r,i,p)=>{let u=s(e),d=c[u]||(c[u]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(u));if(!c[d]){let t=u!==e?e:(e=>{let t,r,o=[{}];for(;t=l.exec(e.replace(a,""));)t[4]?o.shift():t[3]?(r=t[3].replace(n," ").trim(),o.unshift(o[0][r]=o[0][r]||{})):o[0][t[1]]=t[2].replace(n," ").trim();return o[0]})(e);c[d]=o(p?{["@keyframes "+d]:t}:t,r?"":"."+d)}let f=r&&c.g?c.g:null;return r&&(c.g=c[d]),((e,t,r,l)=>{l?t.data=t.data.replace(l,e):-1===t.data.indexOf(e)&&(t.data=r?e+t.data:t.data+e)})(c[d],t,i,f),d},p=(e,t,r)=>e.reduce((e,l,a)=>{let n=t[a];if(n&&n.call){let e=n(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;n=t?"."+t:e&&"object"==typeof e?e.props?"":o(e,""):!1===e?"":e}return e+l+(null==n?"":n)},"");function u(e){let r=this||{},l=e.call?e(r.p):e;return i(l.unshift?l.raw?p(l,[].slice.call(arguments,1),r.p):l.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):l,t(r.target),r.g,r.o,r.k)}let d,f,g,b=u.bind({g:1}),h=u.bind({k:1});function m(e,t,r,l){o.p=t,d=e,f=r,g=l}function j(e,t){let r=this||{};return function(){let l=arguments;function a(n,o){let c=Object.assign({},n),s=c.className||a.className;r.p=Object.assign({theme:f&&f()},c),r.o=/ *go\d+/.test(s),c.className=u.apply(r,l)+(s?" "+s:""),t&&(c.ref=o);let i=e;return e[0]&&(i=c.as||e,delete c.as),g&&i[0]&&g(c),d(i,c)}return t?t(a):a}}

;// ./node_modules/react-hot-toast/dist/index.mjs
"use client";
var W=e=>typeof e=="function",dist_f=(e,t)=>W(e)?e(t):e;var F=(()=>{let e=0;return()=>(++e).toString()})(),A=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})();var Y=20;var U=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,Y)};case 1:return{...e,toasts:e.toasts.map(o=>o.id===t.toast.id?{...o,...t.toast}:o)};case 2:let{toast:r}=t;return U(e,{type:e.toasts.find(o=>o.id===r.id)?1:0,toast:r});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(o=>o.id===s||s===void 0?{...o,dismissed:!0,visible:!1}:o)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(o=>o.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let a=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(o=>({...o,pauseDuration:o.pauseDuration+a}))}}},P=[],y={toasts:[],pausedAt:void 0},dist_u=e=>{y=U(y,e),P.forEach(t=>{t(y)})},q={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},D=(e={})=>{let[t,r]=(0,react.useState)(y),s=(0,react.useRef)(y);(0,react.useEffect)(()=>(s.current!==y&&r(y),P.push(r),()=>{let o=P.indexOf(r);o>-1&&P.splice(o,1)}),[]);let a=t.toasts.map(o=>{var n,i,p;return{...e,...e[o.type],...o,removeDelay:o.removeDelay||((n=e[o.type])==null?void 0:n.removeDelay)||(e==null?void 0:e.removeDelay),duration:o.duration||((i=e[o.type])==null?void 0:i.duration)||(e==null?void 0:e.duration)||q[o.type],style:{...e.style,...(p=e[o.type])==null?void 0:p.style,...o.style}}});return{...t,toasts:a}};var J=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(r==null?void 0:r.id)||F()}),x=e=>(t,r)=>{let s=J(t,e,r);return dist_u({type:2,toast:s}),s.id},dist_c=(e,t)=>x("blank")(e,t);dist_c.error=x("error");dist_c.success=x("success");dist_c.loading=x("loading");dist_c.custom=x("custom");dist_c.dismiss=e=>{dist_u({type:3,toastId:e})};dist_c.remove=e=>dist_u({type:4,toastId:e});dist_c.promise=(e,t,r)=>{let s=dist_c.loading(t.loading,{...r,...r==null?void 0:r.loading});return typeof e=="function"&&(e=e()),e.then(a=>{let o=t.success?dist_f(t.success,a):void 0;return o?dist_c.success(o,{id:s,...r,...r==null?void 0:r.success}):dist_c.dismiss(s),a}).catch(a=>{let o=t.error?dist_f(t.error,a):void 0;o?dist_c.error(o,{id:s,...r,...r==null?void 0:r.error}):dist_c.dismiss(s)}),e};var K=(e,t)=>{dist_u({type:1,toast:{id:e,height:t}})},X=()=>{dist_u({type:5,time:Date.now()})},dist_b=new Map,Z=1e3,ee=(e,t=Z)=>{if(dist_b.has(e))return;let r=setTimeout(()=>{dist_b.delete(e),dist_u({type:4,toastId:e})},t);dist_b.set(e,r)},O=e=>{let{toasts:t,pausedAt:r}=D(e);(0,react.useEffect)(()=>{if(r)return;let o=Date.now(),n=t.map(i=>{if(i.duration===1/0)return;let p=(i.duration||0)+i.pauseDuration-(o-i.createdAt);if(p<0){i.visible&&dist_c.dismiss(i.id);return}return setTimeout(()=>dist_c.dismiss(i.id),p)});return()=>{n.forEach(i=>i&&clearTimeout(i))}},[t,r]);let s=(0,react.useCallback)(()=>{r&&dist_u({type:6,time:Date.now()})},[r]),a=(0,react.useCallback)((o,n)=>{let{reverseOrder:i=!1,gutter:p=8,defaultPosition:d}=n||{},h=t.filter(m=>(m.position||d)===(o.position||d)&&m.height),v=h.findIndex(m=>m.id===o.id),S=h.filter((m,E)=>E<v&&m.visible).length;return h.filter(m=>m.visible).slice(...i?[S+1]:[0,S]).reduce((m,E)=>m+(E.height||0)+p,0)},[t]);return (0,react.useEffect)(()=>{t.forEach(o=>{if(o.dismissed)ee(o.id,o.removeDelay);else{let n=dist_b.get(o.id);n&&(clearTimeout(n),dist_b.delete(o.id))}})},[t]),{toasts:t,handlers:{updateHeight:K,startPause:X,endPause:s,calculateOffset:a}}};var oe=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,re=h`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,se=h`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,k=j("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${oe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${re} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${se} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`;var ne=h`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,V=j("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${ne} 1s linear infinite;
`;var pe=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,de=h`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,_=j("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${pe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${de} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`;var ue=j("div")`
  position: absolute;
`,le=j("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,fe=h`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Te=j("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${fe} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,M=({toast:e})=>{let{icon:t,type:r,iconTheme:s}=e;return t!==void 0?typeof t=="string"?react.createElement(Te,null,t):t:r==="blank"?null:react.createElement(le,null,react.createElement(V,{...s}),r!=="loading"&&react.createElement(ue,null,r==="error"?react.createElement(k,{...s}):react.createElement(_,{...s})))};var ye=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,ge=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,he="0%{opacity:0;} 100%{opacity:1;}",xe="0%{opacity:1;} 100%{opacity:0;}",be=j("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,Se=j("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Ae=(e,t)=>{let s=e.includes("top")?1:-1,[a,o]=A()?[he,xe]:[ye(s),ge(s)];return{animation:t?`${h(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${h(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},C=react.memo(({toast:e,position:t,style:r,children:s})=>{let a=e.height?Ae(e.position||t||"top-center",e.visible):{opacity:0},o=react.createElement(M,{toast:e}),n=react.createElement(Se,{...e.ariaProps},dist_f(e.message,e));return react.createElement(be,{className:e.className,style:{...a,...r,...e.style}},typeof s=="function"?s({icon:o,message:n}):react.createElement(react.Fragment,null,o,n))});m(react.createElement);var ve=({id:e,className:t,style:r,onHeightUpdate:s,children:a})=>{let o=react.useCallback(n=>{if(n){let i=()=>{let p=n.getBoundingClientRect().height;s(e,p)};i(),new MutationObserver(i).observe(n,{subtree:!0,childList:!0,characterData:!0})}},[e,s]);return react.createElement("div",{ref:o,className:t,style:r},a)},Ee=(e,t)=>{let r=e.includes("top"),s=r?{top:0}:{bottom:0},a=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:A()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...s,...a}},De=u`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,R=16,Oe=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:s,children:a,containerStyle:o,containerClassName:n})=>{let{toasts:i,handlers:p}=O(r);return react.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:R,left:R,right:R,bottom:R,pointerEvents:"none",...o},className:n,onMouseEnter:p.startPause,onMouseLeave:p.endPause},i.map(d=>{let h=d.position||t,v=p.calculateOffset(d,{reverseOrder:e,gutter:s,defaultPosition:t}),S=Ee(h,v);return react.createElement(ve,{id:d.id,key:d.id,onHeightUpdate:p.updateHeight,className:d.visible?De:"",style:S},d.type==="custom"?dist_f(d.message,d):a?a(d):react.createElement(C,{toast:d,position:h}))}))};var Vt=dist_c;
//# sourceMappingURL=index.mjs.map

/***/ }),

/***/ 895:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "25b7c495f686777a1c08.woff2";

/***/ }),

/***/ 964:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Settings)
/* harmony export */ });
/* unused harmony export __iconNode */
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9407);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("settings", __iconNode);


//# sourceMappingURL=settings.js.map


/***/ }),

/***/ 1113:
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ 1137:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1354);
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6314);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4417);
/* harmony import */ var _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(6756), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(4722), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_2___ = new URL(/* asset import */ __webpack_require__(5562), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_3___ = new URL(/* asset import */ __webpack_require__(2600), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_4___ = new URL(/* asset import */ __webpack_require__(8735), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_5___ = new URL(/* asset import */ __webpack_require__(4175), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_6___ = new URL(/* asset import */ __webpack_require__(3193), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_7___ = new URL(/* asset import */ __webpack_require__(6569), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_8___ = new URL(/* asset import */ __webpack_require__(7892), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_9___ = new URL(/* asset import */ __webpack_require__(9506), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_10___ = new URL(/* asset import */ __webpack_require__(6477), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_11___ = new URL(/* asset import */ __webpack_require__(6501), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_12___ = new URL(/* asset import */ __webpack_require__(679), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_13___ = new URL(/* asset import */ __webpack_require__(8711), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_2___);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_3___);
var ___CSS_LOADER_URL_REPLACEMENT_4___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_4___);
var ___CSS_LOADER_URL_REPLACEMENT_5___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_5___);
var ___CSS_LOADER_URL_REPLACEMENT_6___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_6___);
var ___CSS_LOADER_URL_REPLACEMENT_7___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_7___);
var ___CSS_LOADER_URL_REPLACEMENT_8___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_8___);
var ___CSS_LOADER_URL_REPLACEMENT_9___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_9___);
var ___CSS_LOADER_URL_REPLACEMENT_10___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_10___);
var ___CSS_LOADER_URL_REPLACEMENT_11___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_11___);
var ___CSS_LOADER_URL_REPLACEMENT_12___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_12___);
var ___CSS_LOADER_URL_REPLACEMENT_13___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_13___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* inter-cyrillic-ext-700-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 700;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_0___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_1___}) format('woff');
  unicode-range: U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F;
}

/* inter-cyrillic-700-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 700;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_2___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_3___}) format('woff');
  unicode-range: U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116;
}

/* inter-greek-ext-700-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 700;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_4___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_5___}) format('woff');
  unicode-range: U+1F00-1FFF;
}

/* inter-greek-700-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 700;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_6___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_7___}) format('woff');
  unicode-range: U+0370-0377,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03FF;
}

/* inter-vietnamese-700-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 700;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_8___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_9___}) format('woff');
  unicode-range: U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB;
}

/* inter-latin-ext-700-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 700;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_10___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_11___}) format('woff');
  unicode-range: U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;
}

/* inter-latin-700-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 700;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_12___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_13___}) format('woff');
  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
}`, "",{"version":3,"sources":["webpack://./node_modules/@fontsource/inter/700.css"],"names":[],"mappings":"AAAA,kCAAkC;AAClC;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,oHAAqI;EACrI,iFAAiF;AACnF;;AAEA,8BAA8B;AAC9B;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,oHAA6H;EAC7H,gEAAgE;AAClE;;AAEA,+BAA+B;AAC/B;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,oHAA+H;EAC/H,0BAA0B;AAC5B;;AAEA,2BAA2B;AAC3B;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,oHAAuH;EACvH,iFAAiF;AACnF;;AAEA,gCAAgC;AAChC;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,oHAAiI;EACjI,2JAA2J;AAC7J;;AAEA,+BAA+B;AAC/B;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,sHAA+H;EAC/H,iMAAiM;AACnM;;AAEA,2BAA2B;AAC3B;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,sHAAuH;EACvH,uKAAuK;AACzK","sourcesContent":["/* inter-cyrillic-ext-700-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 700;\n  src: url(./files/inter-cyrillic-ext-700-normal.woff2) format('woff2'), url(./files/inter-cyrillic-ext-700-normal.woff) format('woff');\n  unicode-range: U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F;\n}\n\n/* inter-cyrillic-700-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 700;\n  src: url(./files/inter-cyrillic-700-normal.woff2) format('woff2'), url(./files/inter-cyrillic-700-normal.woff) format('woff');\n  unicode-range: U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116;\n}\n\n/* inter-greek-ext-700-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 700;\n  src: url(./files/inter-greek-ext-700-normal.woff2) format('woff2'), url(./files/inter-greek-ext-700-normal.woff) format('woff');\n  unicode-range: U+1F00-1FFF;\n}\n\n/* inter-greek-700-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 700;\n  src: url(./files/inter-greek-700-normal.woff2) format('woff2'), url(./files/inter-greek-700-normal.woff) format('woff');\n  unicode-range: U+0370-0377,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03FF;\n}\n\n/* inter-vietnamese-700-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 700;\n  src: url(./files/inter-vietnamese-700-normal.woff2) format('woff2'), url(./files/inter-vietnamese-700-normal.woff) format('woff');\n  unicode-range: U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB;\n}\n\n/* inter-latin-ext-700-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 700;\n  src: url(./files/inter-latin-ext-700-normal.woff2) format('woff2'), url(./files/inter-latin-ext-700-normal.woff) format('woff');\n  unicode-range: U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;\n}\n\n/* inter-latin-700-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 700;\n  src: url(./files/inter-latin-700-normal.woff2) format('woff2'), url(./files/inter-latin-700-normal.woff) format('woff');\n  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 1158:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "9ec3b40ece10debf7a33.woff";

/***/ }),

/***/ 1354:
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ 1635:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Tt: () => (/* binding */ __rest)
/* harmony export */ });
/* unused harmony exports __extends, __assign, __decorate, __param, __esDecorate, __runInitializers, __propKey, __setFunctionName, __metadata, __awaiter, __generator, __createBinding, __exportStar, __values, __read, __spread, __spreadArrays, __spreadArray, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet, __classPrivateFieldIn, __addDisposableResource, __disposeResources, __rewriteRelativeImportExtension */
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  }
  return __assign.apply(this, arguments);
}

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
      for (var p in contextIn.access) context.access[p] = contextIn.access[p];
      context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
      var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
      if (kind === "accessor") {
          if (result === void 0) continue;
          if (result === null || typeof result !== "object") throw new TypeError("Object expected");
          if (_ = accept(result.get)) descriptor.get = _;
          if (_ = accept(result.set)) descriptor.set = _;
          if (_ = accept(result.init)) initializers.unshift(_);
      }
      else if (_ = accept(result)) {
          if (kind === "field") initializers.unshift(_);
          else descriptor[key] = _;
      }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};

function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
      value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};

function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
};

function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
      next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
      }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  }
  catch (error) { e = { error: error }; }
  finally {
      try {
          if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
  }
  return ar;
}

/** @deprecated */
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
  return ar;
}

/** @deprecated */
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
  return r;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
  function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
  function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
  function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
  function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
  function fulfill(value) { resume("next", value); }
  function reject(value) { resume("throw", value); }
  function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
  function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
  return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
};

var ownKeys = function(o) {
  ownKeys = Object.getOwnPropertyNames || function (o) {
    var ar = [];
    for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
    return ar;
  };
  return ownKeys(o);
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
  __setModuleDefault(result, mod);
  return result;
}

function __importDefault(mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}

function __addDisposableResource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
    env.stack.push({ value: value, dispose: dispose, async: async });
  }
  else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
  function fail(e) {
    env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
    env.hasError = true;
  }
  var r, s = 0;
  function next() {
    while (r = env.stack.pop()) {
      try {
        if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
        if (r.dispose) {
          var result = r.dispose.call(r.value);
          if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
        }
        else s |= 1;
      }
      catch (e) {
        fail(e);
      }
    }
    if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
    if (env.hasError) throw env.error;
  }
  return next();
}

function __rewriteRelativeImportExtension(path, preserveJsx) {
  if (typeof path === "string" && /^\.\.?\//.test(path)) {
      return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
          return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
      });
  }
  return path;
}

/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ({
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __esDecorate,
  __runInitializers,
  __propKey,
  __setFunctionName,
  __metadata,
  __awaiter,
  __generator,
  __createBinding,
  __exportStar,
  __values,
  __read,
  __spread,
  __spreadArrays,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet,
  __classPrivateFieldSet,
  __classPrivateFieldIn,
  __addDisposableResource,
  __disposeResources,
  __rewriteRelativeImportExtension,
});


/***/ }),

/***/ 1645:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "fd1478dcc74de00ee4c0.woff2";

/***/ }),

/***/ 2351:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "2f93aaa35e870cec4704.woff";

/***/ }),

/***/ 2389:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  r9: () => (/* reexport */ initReactI18next),
  Bd: () => (/* reexport */ useTranslation_useTranslation)
});

// UNUSED EXPORTS: I18nContext, I18nextProvider, Trans, TransWithoutContext, Translation, composeInitialProps, date, getDefaults, getI18n, getInitialProps, number, plural, select, selectOrdinal, setDefaults, setI18n, time, useSSR, withSSR, withTranslation

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/void-elements/index.js
var void_elements = __webpack_require__(4915);
var void_elements_default = /*#__PURE__*/__webpack_require__.n(void_elements);
;// ./node_modules/html-parse-stringify/dist/html-parse-stringify.module.js
var t=/\s([^'"/\s><]+?)[\s/>]|([^\s=]+)=\s?(".*?"|'.*?')/g;function n(n){var r={type:"tag",name:"",voidElement:!1,attrs:{},children:[]},i=n.match(/<\/?([^\s]+?)[/\s>]/);if(i&&(r.name=i[1],((void_elements_default())[i[1]]||"/"===n.charAt(n.length-2))&&(r.voidElement=!0),r.name.startsWith("!--"))){var s=n.indexOf("--\x3e");return{type:"comment",comment:-1!==s?n.slice(4,s):""}}for(var a=new RegExp(t),c=null;null!==(c=a.exec(n));)if(c[0].trim())if(c[1]){var o=c[1].trim(),l=[o,""];o.indexOf("=")>-1&&(l=o.split("=")),r.attrs[l[0]]=l[1],a.lastIndex--}else c[2]&&(r.attrs[c[2]]=c[3].trim().substring(1,c[3].length-1));return r}var r=/<[a-zA-Z0-9\-\!\/](?:"[^"]*"|'[^']*'|[^'">])*>/g,i=/^\s*$/,s=Object.create(null);function a(e,t){switch(t.type){case"text":return e+t.content;case"tag":return e+="<"+t.name+(t.attrs?function(e){var t=[];for(var n in e)t.push(n+'="'+e[n]+'"');return t.length?" "+t.join(" "):""}(t.attrs):"")+(t.voidElement?"/>":">"),t.voidElement?e:e+t.children.reduce(a,"")+"</"+t.name+">";case"comment":return e+"\x3c!--"+t.comment+"--\x3e"}}var c={parse:function(e,t){t||(t={}),t.components||(t.components=s);var a,c=[],o=[],l=-1,m=!1;if(0!==e.indexOf("<")){var u=e.indexOf("<");c.push({type:"text",content:-1===u?e:e.substring(0,u)})}return e.replace(r,function(r,s){if(m){if(r!=="</"+a.name+">")return;m=!1}var u,f="/"!==r.charAt(1),h=r.startsWith("\x3c!--"),p=s+r.length,d=e.charAt(p);if(h){var v=n(r);return l<0?(c.push(v),c):((u=o[l]).children.push(v),c)}if(f&&(l++,"tag"===(a=n(r)).type&&t.components[a.name]&&(a.type="component",m=!0),a.voidElement||m||!d||"<"===d||a.children.push({type:"text",content:e.slice(p,e.indexOf("<",p))}),0===l&&c.push(a),(u=o[l-1])&&u.children.push(a),o[l]=a),(!f||a.voidElement)&&(l>-1&&(a.voidElement||a.name===r.slice(2,-1))&&(l--,a=-1===l?c:o[l]),!m&&"<"!==d&&d)){u=-1===l?c:o[l].children;var x=e.indexOf("<",p),g=e.slice(p,-1===x?void 0:x);i.test(g)&&(g=" "),(x>-1&&l+u.length>=0||" "!==g)&&u.push({type:"text",content:g})}}),c},stringify:function(e){return e.reduce(function(e,t){return e+a("",t)},"")}};/* harmony default export */ const html_parse_stringify_module = ((/* unused pure expression or super */ null && (c)));
//# sourceMappingURL=html-parse-stringify.module.js.map

;// ./node_modules/react-i18next/dist/es/utils.js
const utils_warn = (i18n, code, msg, rest) => {
  const args = [msg, {
    code,
    ...(rest || {})
  }];
  if (i18n?.services?.logger?.forward) {
    return i18n.services.logger.forward(args, 'warn', 'react-i18next::', true);
  }
  if (utils_isString(args[0])) args[0] = `react-i18next:: ${args[0]}`;
  if (i18n?.services?.logger?.warn) {
    i18n.services.logger.warn(...args);
  } else if (console?.warn) {
    console.warn(...args);
  }
};
const alreadyWarned = {};
const utils_warnOnce = (i18n, code, msg, rest) => {
  if (utils_isString(msg) && alreadyWarned[msg]) return;
  if (utils_isString(msg)) alreadyWarned[msg] = new Date();
  utils_warn(i18n, code, msg, rest);
};
const loadedClb = (i18n, cb) => () => {
  if (i18n.isInitialized) {
    cb();
  } else {
    const initialized = () => {
      setTimeout(() => {
        i18n.off('initialized', initialized);
      }, 0);
      cb();
    };
    i18n.on('initialized', initialized);
  }
};
const loadNamespaces = (i18n, ns, cb) => {
  i18n.loadNamespaces(ns, loadedClb(i18n, cb));
};
const loadLanguages = (i18n, lng, ns, cb) => {
  if (utils_isString(ns)) ns = [ns];
  if (i18n.options.preload && i18n.options.preload.indexOf(lng) > -1) return loadNamespaces(i18n, ns, cb);
  ns.forEach(n => {
    if (i18n.options.ns.indexOf(n) < 0) i18n.options.ns.push(n);
  });
  i18n.loadLanguages(lng, loadedClb(i18n, cb));
};
const hasLoadedNamespace = (ns, i18n, options = {}) => {
  if (!i18n.languages || !i18n.languages.length) {
    utils_warnOnce(i18n, 'NO_LANGUAGES', 'i18n.languages were undefined or empty', {
      languages: i18n.languages
    });
    return true;
  }
  return i18n.hasLoadedNamespace(ns, {
    lng: options.lng,
    precheck: (i18nInstance, loadNotPending) => {
      if (options.bindI18n && options.bindI18n.indexOf('languageChanging') > -1 && i18nInstance.services.backendConnector.backend && i18nInstance.isLanguageChangingTo && !loadNotPending(i18nInstance.isLanguageChangingTo, ns)) return false;
    }
  });
};
const utils_getDisplayName = Component => Component.displayName || Component.name || (utils_isString(Component) && Component.length > 0 ? Component : 'Unknown');
const utils_isString = obj => typeof obj === 'string';
const utils_isObject = obj => typeof obj === 'object' && obj !== null;
;// ./node_modules/react-i18next/dist/es/unescape.js
const matchHtmlEntity = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g;
const htmlEntities = {
  '&amp;': '&',
  '&#38;': '&',
  '&lt;': '<',
  '&#60;': '<',
  '&gt;': '>',
  '&#62;': '>',
  '&apos;': "'",
  '&#39;': "'",
  '&quot;': '"',
  '&#34;': '"',
  '&nbsp;': ' ',
  '&#160;': ' ',
  '&copy;': '©',
  '&#169;': '©',
  '&reg;': '®',
  '&#174;': '®',
  '&hellip;': '…',
  '&#8230;': '…',
  '&#x2F;': '/',
  '&#47;': '/'
};
const unescapeHtmlEntity = m => htmlEntities[m];
const unescape_unescape = text => text.replace(matchHtmlEntity, unescapeHtmlEntity);
;// ./node_modules/react-i18next/dist/es/defaults.js

let defaultOptions = {
  bindI18n: 'languageChanged',
  bindI18nStore: '',
  transEmptyNodeValue: '',
  transSupportBasicHtmlNodes: true,
  transWrapTextNodes: '',
  transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
  useSuspense: true,
  unescape: unescape_unescape
};
const setDefaults = (options = {}) => {
  defaultOptions = {
    ...defaultOptions,
    ...options
  };
};
const defaults_getDefaults = () => defaultOptions;
;// ./node_modules/react-i18next/dist/es/TransWithoutContext.js





const hasChildren = (node, checkLength) => {
  if (!node) return false;
  const base = node.props?.children ?? node.children;
  if (checkLength) return base.length > 0;
  return !!base;
};
const getChildren = node => {
  if (!node) return [];
  const children = node.props?.children ?? node.children;
  return node.props?.i18nIsDynamicList ? getAsArray(children) : children;
};
const hasValidReactChildren = children => Array.isArray(children) && children.every(isValidElement);
const getAsArray = data => Array.isArray(data) ? data : [data];
const mergeProps = (source, target) => {
  const newTarget = {
    ...target
  };
  newTarget.props = Object.assign(source.props, target.props);
  return newTarget;
};
const nodesToString = (children, i18nOptions, i18n, i18nKey) => {
  if (!children) return '';
  let stringNode = '';
  const childrenArray = getAsArray(children);
  const keepArray = i18nOptions?.transSupportBasicHtmlNodes ? i18nOptions.transKeepBasicHtmlNodesFor ?? [] : [];
  childrenArray.forEach((child, childIndex) => {
    if (isString(child)) {
      stringNode += `${child}`;
      return;
    }
    if (isValidElement(child)) {
      const {
        props,
        type
      } = child;
      const childPropsCount = Object.keys(props).length;
      const shouldKeepChild = keepArray.indexOf(type) > -1;
      const childChildren = props.children;
      if (!childChildren && shouldKeepChild && !childPropsCount) {
        stringNode += `<${type}/>`;
        return;
      }
      if (!childChildren && (!shouldKeepChild || childPropsCount) || props.i18nIsDynamicList) {
        stringNode += `<${childIndex}></${childIndex}>`;
        return;
      }
      if (shouldKeepChild && childPropsCount === 1 && isString(childChildren)) {
        stringNode += `<${type}>${childChildren}</${type}>`;
        return;
      }
      const content = nodesToString(childChildren, i18nOptions, i18n, i18nKey);
      stringNode += `<${childIndex}>${content}</${childIndex}>`;
      return;
    }
    if (child === null) {
      warn(i18n, 'TRANS_NULL_VALUE', `Passed in a null value as child`, {
        i18nKey
      });
      return;
    }
    if (isObject(child)) {
      const {
        format,
        ...clone
      } = child;
      const keys = Object.keys(clone);
      if (keys.length === 1) {
        const value = format ? `${keys[0]}, ${format}` : keys[0];
        stringNode += `{{${value}}}`;
        return;
      }
      warn(i18n, 'TRANS_INVALID_OBJ', `Invalid child - Object should only have keys {{ value, format }} (format is optional).`, {
        i18nKey,
        child
      });
      return;
    }
    warn(i18n, 'TRANS_INVALID_VAR', `Passed in a variable like {number} - pass variables for interpolation as full objects like {{number}}.`, {
      i18nKey,
      child
    });
  });
  return stringNode;
};
const renderNodes = (children, knownComponentsMap, targetString, i18n, i18nOptions, combinedTOpts, shouldUnescape) => {
  if (targetString === '') return [];
  const keepArray = i18nOptions.transKeepBasicHtmlNodesFor || [];
  const emptyChildrenButNeedsHandling = targetString && new RegExp(keepArray.map(keep => `<${keep}`).join('|')).test(targetString);
  if (!children && !knownComponentsMap && !emptyChildrenButNeedsHandling && !shouldUnescape) return [targetString];
  const data = knownComponentsMap ?? {};
  const getData = childs => {
    const childrenArray = getAsArray(childs);
    childrenArray.forEach(child => {
      if (isString(child)) return;
      if (hasChildren(child)) getData(getChildren(child));else if (isObject(child) && !isValidElement(child)) Object.assign(data, child);
    });
  };
  getData(children);
  const ast = HTML.parse(`<0>${targetString}</0>`);
  const opts = {
    ...data,
    ...combinedTOpts
  };
  const renderInner = (child, node, rootReactNode) => {
    const childs = getChildren(child);
    const mappedChildren = mapAST(childs, node.children, rootReactNode);
    return hasValidReactChildren(childs) && mappedChildren.length === 0 || child.props?.i18nIsDynamicList ? childs : mappedChildren;
  };
  const pushTranslatedJSX = (child, inner, mem, i, isVoid) => {
    if (child.dummy) {
      child.children = inner;
      mem.push(cloneElement(child, {
        key: i
      }, isVoid ? undefined : inner));
    } else {
      mem.push(...Children.map([child], c => {
        const props = {
          ...c.props
        };
        delete props.i18nIsDynamicList;
        return createElement(c.type, {
          ...props,
          key: i,
          ref: c.props.ref ?? c.ref
        }, isVoid ? null : inner);
      }));
    }
  };
  const mapAST = (reactNode, astNode, rootReactNode) => {
    const reactNodes = getAsArray(reactNode);
    const astNodes = getAsArray(astNode);
    return astNodes.reduce((mem, node, i) => {
      const translationContent = node.children?.[0]?.content && i18n.services.interpolator.interpolate(node.children[0].content, opts, i18n.language);
      if (node.type === 'tag') {
        let tmp = reactNodes[parseInt(node.name, 10)];
        if (!tmp && knownComponentsMap) tmp = knownComponentsMap[node.name];
        if (rootReactNode.length === 1 && !tmp) tmp = rootReactNode[0][node.name];
        if (!tmp) tmp = {};
        const child = Object.keys(node.attrs).length !== 0 ? mergeProps({
          props: node.attrs
        }, tmp) : tmp;
        const isElement = isValidElement(child);
        const isValidTranslationWithChildren = isElement && hasChildren(node, true) && !node.voidElement;
        const isEmptyTransWithHTML = emptyChildrenButNeedsHandling && isObject(child) && child.dummy && !isElement;
        const isKnownComponent = isObject(knownComponentsMap) && Object.hasOwnProperty.call(knownComponentsMap, node.name);
        if (isString(child)) {
          const value = i18n.services.interpolator.interpolate(child, opts, i18n.language);
          mem.push(value);
        } else if (hasChildren(child) || isValidTranslationWithChildren) {
          const inner = renderInner(child, node, rootReactNode);
          pushTranslatedJSX(child, inner, mem, i);
        } else if (isEmptyTransWithHTML) {
          const inner = mapAST(reactNodes, node.children, rootReactNode);
          pushTranslatedJSX(child, inner, mem, i);
        } else if (Number.isNaN(parseFloat(node.name))) {
          if (isKnownComponent) {
            const inner = renderInner(child, node, rootReactNode);
            pushTranslatedJSX(child, inner, mem, i, node.voidElement);
          } else if (i18nOptions.transSupportBasicHtmlNodes && keepArray.indexOf(node.name) > -1) {
            if (node.voidElement) {
              mem.push(createElement(node.name, {
                key: `${node.name}-${i}`
              }));
            } else {
              const inner = mapAST(reactNodes, node.children, rootReactNode);
              mem.push(createElement(node.name, {
                key: `${node.name}-${i}`
              }, inner));
            }
          } else if (node.voidElement) {
            mem.push(`<${node.name} />`);
          } else {
            const inner = mapAST(reactNodes, node.children, rootReactNode);
            mem.push(`<${node.name}>${inner}</${node.name}>`);
          }
        } else if (isObject(child) && !isElement) {
          const content = node.children[0] ? translationContent : null;
          if (content) mem.push(content);
        } else {
          pushTranslatedJSX(child, translationContent, mem, i, node.children.length !== 1 || !translationContent);
        }
      } else if (node.type === 'text') {
        const wrapTextNodes = i18nOptions.transWrapTextNodes;
        const content = shouldUnescape ? i18nOptions.unescape(i18n.services.interpolator.interpolate(node.content, opts, i18n.language)) : i18n.services.interpolator.interpolate(node.content, opts, i18n.language);
        if (wrapTextNodes) {
          mem.push(createElement(wrapTextNodes, {
            key: `${node.name}-${i}`
          }, content));
        } else {
          mem.push(content);
        }
      }
      return mem;
    }, []);
  };
  const result = mapAST([{
    dummy: true,
    children: children || []
  }], ast, getAsArray(children || []));
  return getChildren(result[0]);
};
const fixComponentProps = (component, index, translation) => {
  const componentKey = component.key || index;
  const comp = cloneElement(component, {
    key: componentKey
  });
  if (!comp.props || !comp.props.children || translation.indexOf(`${index}/>`) < 0 && translation.indexOf(`${index} />`) < 0) {
    return comp;
  }
  function Componentized() {
    return createElement(Fragment, null, comp);
  }
  return createElement(Componentized, {
    key: componentKey
  });
};
const generateArrayComponents = (components, translation) => components.map((c, index) => fixComponentProps(c, index, translation));
const generateObjectComponents = (components, translation) => {
  const componentMap = {};
  Object.keys(components).forEach(c => {
    Object.assign(componentMap, {
      [c]: fixComponentProps(components[c], c, translation)
    });
  });
  return componentMap;
};
const generateComponents = (components, translation, i18n, i18nKey) => {
  if (!components) return null;
  if (Array.isArray(components)) {
    return generateArrayComponents(components, translation);
  }
  if (isObject(components)) {
    return generateObjectComponents(components, translation);
  }
  warnOnce(i18n, 'TRANS_INVALID_COMPONENTS', `<Trans /> "components" prop expects an object or array`, {
    i18nKey
  });
  return null;
};
const isComponentsMap = object => {
  if (!isObject(object)) return false;
  if (Array.isArray(object)) return false;
  return Object.keys(object).reduce((acc, key) => acc && Number.isNaN(Number.parseFloat(key)), true);
};
function Trans({
  children,
  count,
  parent,
  i18nKey,
  context,
  tOptions = {},
  values,
  defaults,
  components,
  ns,
  i18n: i18nFromProps,
  t: tFromProps,
  shouldUnescape,
  ...additionalProps
}) {
  const i18n = i18nFromProps || getI18n();
  if (!i18n) {
    warnOnce(i18n, 'NO_I18NEXT_INSTANCE', `Trans: You need to pass in an i18next instance using i18nextReactModule`, {
      i18nKey
    });
    return children;
  }
  const t = tFromProps || i18n.t.bind(i18n) || (k => k);
  const reactI18nextOptions = {
    ...getDefaults(),
    ...i18n.options?.react
  };
  let namespaces = ns || t.ns || i18n.options?.defaultNS;
  namespaces = isString(namespaces) ? [namespaces] : namespaces || ['translation'];
  const nodeAsString = nodesToString(children, reactI18nextOptions, i18n, i18nKey);
  const defaultValue = defaults || nodeAsString || reactI18nextOptions.transEmptyNodeValue || i18nKey;
  const {
    hashTransKey
  } = reactI18nextOptions;
  const key = i18nKey || (hashTransKey ? hashTransKey(nodeAsString || defaultValue) : nodeAsString || defaultValue);
  if (i18n.options?.interpolation?.defaultVariables) {
    values = values && Object.keys(values).length > 0 ? {
      ...values,
      ...i18n.options.interpolation.defaultVariables
    } : {
      ...i18n.options.interpolation.defaultVariables
    };
  }
  const interpolationOverride = values || count !== undefined && !i18n.options?.interpolation?.alwaysFormat || !children ? tOptions.interpolation : {
    interpolation: {
      ...tOptions.interpolation,
      prefix: '#$?',
      suffix: '?$#'
    }
  };
  const combinedTOpts = {
    ...tOptions,
    context: context || tOptions.context,
    count,
    ...values,
    ...interpolationOverride,
    defaultValue,
    ns: namespaces
  };
  const translation = key ? t(key, combinedTOpts) : defaultValue;
  const generatedComponents = generateComponents(components, translation, i18n, i18nKey);
  let indexedChildren = generatedComponents || children;
  let componentsMap = null;
  if (isComponentsMap(generatedComponents)) {
    componentsMap = generatedComponents;
    indexedChildren = children;
  }
  const content = renderNodes(indexedChildren, componentsMap, translation, i18n, reactI18nextOptions, combinedTOpts, shouldUnescape);
  const useAsParent = parent ?? reactI18nextOptions.defaultTransParent;
  return useAsParent ? createElement(useAsParent, additionalProps, content) : content;
}
;// ./node_modules/react-i18next/dist/es/i18nInstance.js
let i18nInstance;
const setI18n = instance => {
  i18nInstance = instance;
};
const i18nInstance_getI18n = () => i18nInstance;
;// ./node_modules/react-i18next/dist/es/initReactI18next.js


const initReactI18next = {
  type: '3rdParty',
  init(instance) {
    setDefaults(instance.options.react);
    setI18n(instance);
  }
};
;// ./node_modules/react-i18next/dist/es/context.js





const context_I18nContext = (0,react.createContext)();
class ReportNamespaces {
  constructor() {
    this.usedNamespaces = {};
  }
  addUsedNamespaces(namespaces) {
    namespaces.forEach(ns => {
      if (!this.usedNamespaces[ns]) this.usedNamespaces[ns] = true;
    });
  }
  getUsedNamespaces() {
    return Object.keys(this.usedNamespaces);
  }
}
const context_composeInitialProps = ForComponent => async ctx => {
  const componentsInitialProps = (await ForComponent.getInitialProps?.(ctx)) ?? {};
  const i18nInitialProps = getInitialProps();
  return {
    ...componentsInitialProps,
    ...i18nInitialProps
  };
};
const getInitialProps = () => {
  const i18n = getI18n();
  const namespaces = i18n.reportNamespaces?.getUsedNamespaces() ?? [];
  const ret = {};
  const initialI18nStore = {};
  i18n.languages.forEach(l => {
    initialI18nStore[l] = {};
    namespaces.forEach(ns => {
      initialI18nStore[l][ns] = i18n.getResourceBundle(l, ns) || {};
    });
  });
  ret.initialI18nStore = initialI18nStore;
  ret.initialLanguage = i18n.language;
  return ret;
};
;// ./node_modules/react-i18next/dist/es/Trans.js




function Trans_Trans({
  children,
  count,
  parent,
  i18nKey,
  context,
  tOptions = {},
  values,
  defaults,
  components,
  ns,
  i18n: i18nFromProps,
  t: tFromProps,
  shouldUnescape,
  ...additionalProps
}) {
  const {
    i18n: i18nFromContext,
    defaultNS: defaultNSFromContext
  } = useContext(I18nContext) || {};
  const i18n = i18nFromProps || i18nFromContext || getI18n();
  const t = tFromProps || i18n?.t.bind(i18n);
  return TransWithoutContext({
    children,
    count,
    parent,
    i18nKey,
    context,
    tOptions,
    values,
    defaults,
    components,
    ns: ns || t?.ns || defaultNSFromContext || i18n?.options?.defaultNS,
    i18n,
    t: tFromProps,
    shouldUnescape,
    ...additionalProps
  });
}
;// ./node_modules/react-i18next/dist/es/useTranslation.js



const usePrevious = (value, ignore) => {
  const ref = (0,react.useRef)();
  (0,react.useEffect)(() => {
    ref.current = ignore ? ref.current : value;
  }, [value, ignore]);
  return ref.current;
};
const alwaysNewT = (i18n, language, namespace, keyPrefix) => i18n.getFixedT(language, namespace, keyPrefix);
const useMemoizedT = (i18n, language, namespace, keyPrefix) => (0,react.useCallback)(alwaysNewT(i18n, language, namespace, keyPrefix), [i18n, language, namespace, keyPrefix]);
const useTranslation_useTranslation = (ns, props = {}) => {
  const {
    i18n: i18nFromProps
  } = props;
  const {
    i18n: i18nFromContext,
    defaultNS: defaultNSFromContext
  } = (0,react.useContext)(context_I18nContext) || {};
  const i18n = i18nFromProps || i18nFromContext || i18nInstance_getI18n();
  if (i18n && !i18n.reportNamespaces) i18n.reportNamespaces = new ReportNamespaces();
  if (!i18n) {
    utils_warnOnce(i18n, 'NO_I18NEXT_INSTANCE', 'useTranslation: You will need to pass in an i18next instance by using initReactI18next');
    const notReadyT = (k, optsOrDefaultValue) => {
      if (utils_isString(optsOrDefaultValue)) return optsOrDefaultValue;
      if (utils_isObject(optsOrDefaultValue) && utils_isString(optsOrDefaultValue.defaultValue)) return optsOrDefaultValue.defaultValue;
      return Array.isArray(k) ? k[k.length - 1] : k;
    };
    const retNotReady = [notReadyT, {}, false];
    retNotReady.t = notReadyT;
    retNotReady.i18n = {};
    retNotReady.ready = false;
    return retNotReady;
  }
  if (i18n.options.react?.wait) utils_warnOnce(i18n, 'DEPRECATED_OPTION', 'useTranslation: It seems you are still using the old wait option, you may migrate to the new useSuspense behaviour.');
  const i18nOptions = {
    ...defaults_getDefaults(),
    ...i18n.options.react,
    ...props
  };
  const {
    useSuspense,
    keyPrefix
  } = i18nOptions;
  let namespaces = ns || defaultNSFromContext || i18n.options?.defaultNS;
  namespaces = utils_isString(namespaces) ? [namespaces] : namespaces || ['translation'];
  i18n.reportNamespaces.addUsedNamespaces?.(namespaces);
  const ready = (i18n.isInitialized || i18n.initializedStoreOnce) && namespaces.every(n => hasLoadedNamespace(n, i18n, i18nOptions));
  const memoGetT = useMemoizedT(i18n, props.lng || null, i18nOptions.nsMode === 'fallback' ? namespaces : namespaces[0], keyPrefix);
  const getT = () => memoGetT;
  const getNewT = () => alwaysNewT(i18n, props.lng || null, i18nOptions.nsMode === 'fallback' ? namespaces : namespaces[0], keyPrefix);
  const [t, setT] = (0,react.useState)(getT);
  let joinedNS = namespaces.join();
  if (props.lng) joinedNS = `${props.lng}${joinedNS}`;
  const previousJoinedNS = usePrevious(joinedNS);
  const isMounted = (0,react.useRef)(true);
  (0,react.useEffect)(() => {
    const {
      bindI18n,
      bindI18nStore
    } = i18nOptions;
    isMounted.current = true;
    if (!ready && !useSuspense) {
      if (props.lng) {
        loadLanguages(i18n, props.lng, namespaces, () => {
          if (isMounted.current) setT(getNewT);
        });
      } else {
        loadNamespaces(i18n, namespaces, () => {
          if (isMounted.current) setT(getNewT);
        });
      }
    }
    if (ready && previousJoinedNS && previousJoinedNS !== joinedNS && isMounted.current) {
      setT(getNewT);
    }
    const boundReset = () => {
      if (isMounted.current) setT(getNewT);
    };
    if (bindI18n) i18n?.on(bindI18n, boundReset);
    if (bindI18nStore) i18n?.store.on(bindI18nStore, boundReset);
    return () => {
      isMounted.current = false;
      if (i18n && bindI18n) bindI18n?.split(' ').forEach(e => i18n.off(e, boundReset));
      if (bindI18nStore && i18n) bindI18nStore.split(' ').forEach(e => i18n.store.off(e, boundReset));
    };
  }, [i18n, joinedNS]);
  (0,react.useEffect)(() => {
    if (isMounted.current && ready) {
      setT(getT);
    }
  }, [i18n, keyPrefix, ready]);
  const ret = [t, i18n, ready];
  ret.t = t;
  ret.i18n = i18n;
  ret.ready = ready;
  if (ready) return ret;
  if (!ready && !useSuspense) return ret;
  throw new Promise(resolve => {
    if (props.lng) {
      loadLanguages(i18n, props.lng, namespaces, () => resolve());
    } else {
      loadNamespaces(i18n, namespaces, () => resolve());
    }
  });
};
;// ./node_modules/react-i18next/dist/es/withTranslation.js



const withTranslation = (ns, options = {}) => function Extend(WrappedComponent) {
  function I18nextWithTranslation({
    forwardedRef,
    ...rest
  }) {
    const [t, i18n, ready] = useTranslation(ns, {
      ...rest,
      keyPrefix: options.keyPrefix
    });
    const passDownProps = {
      ...rest,
      t,
      i18n,
      tReady: ready
    };
    if (options.withRef && forwardedRef) {
      passDownProps.ref = forwardedRef;
    } else if (!options.withRef && forwardedRef) {
      passDownProps.forwardedRef = forwardedRef;
    }
    return createElement(WrappedComponent, passDownProps);
  }
  I18nextWithTranslation.displayName = `withI18nextTranslation(${getDisplayName(WrappedComponent)})`;
  I18nextWithTranslation.WrappedComponent = WrappedComponent;
  const forwardRef = (props, ref) => createElement(I18nextWithTranslation, Object.assign({}, props, {
    forwardedRef: ref
  }));
  return options.withRef ? forwardRefReact(forwardRef) : I18nextWithTranslation;
};
;// ./node_modules/react-i18next/dist/es/Translation.js

const Translation = ({
  ns,
  children,
  ...options
}) => {
  const [t, i18n, ready] = useTranslation(ns, options);
  return children(t, {
    i18n,
    lng: i18n.language
  }, ready);
};
;// ./node_modules/react-i18next/dist/es/I18nextProvider.js


function I18nextProvider({
  i18n,
  defaultNS,
  children
}) {
  const value = useMemo(() => ({
    i18n,
    defaultNS
  }), [i18n, defaultNS]);
  return createElement(I18nContext.Provider, {
    value
  }, children);
}
;// ./node_modules/react-i18next/dist/es/useSSR.js


const useSSR_useSSR = (initialI18nStore, initialLanguage, props = {}) => {
  const {
    i18n: i18nFromProps
  } = props;
  const {
    i18n: i18nFromContext
  } = useContext(I18nContext) || {};
  const i18n = i18nFromProps || i18nFromContext || getI18n();
  if (i18n.options?.isClone) return;
  if (initialI18nStore && !i18n.initializedStoreOnce) {
    i18n.services.resourceStore.data = initialI18nStore;
    i18n.options.ns = Object.values(initialI18nStore).reduce((mem, lngResources) => {
      Object.keys(lngResources).forEach(ns => {
        if (mem.indexOf(ns) < 0) mem.push(ns);
      });
      return mem;
    }, i18n.options.ns);
    i18n.initializedStoreOnce = true;
    i18n.isInitialized = true;
  }
  if (initialLanguage && !i18n.initializedLanguageOnce) {
    i18n.changeLanguage(initialLanguage);
    i18n.initializedLanguageOnce = true;
  }
};
;// ./node_modules/react-i18next/dist/es/withSSR.js




const withSSR = () => function Extend(WrappedComponent) {
  function I18nextWithSSR({
    initialI18nStore,
    initialLanguage,
    ...rest
  }) {
    useSSR(initialI18nStore, initialLanguage);
    return createElement(WrappedComponent, {
      ...rest
    });
  }
  I18nextWithSSR.getInitialProps = composeInitialProps(WrappedComponent);
  I18nextWithSSR.displayName = `withI18nextSSR(${getDisplayName(WrappedComponent)})`;
  I18nextWithSSR.WrappedComponent = WrappedComponent;
  return I18nextWithSSR;
};
;// ./node_modules/react-i18next/dist/es/index.js












const date = () => '';
const time = () => '';
const number = () => '';
const es_select = () => '';
const plural = () => '';
const selectOrdinal = () => '';

/***/ }),

/***/ 2600:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "03cc5c4a68b77f60ea9b.woff";

/***/ }),

/***/ 2635:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ay: () => (/* binding */ instance)
/* harmony export */ });
/* unused harmony exports changeLanguage, createInstance, dir, exists, getFixedT, hasLoadedNamespace, init, loadLanguages, loadNamespaces, loadResources, reloadResources, setDefaultNamespace, t, use */
const isString = obj => typeof obj === 'string';
const defer = () => {
  let res;
  let rej;
  const promise = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });
  promise.resolve = res;
  promise.reject = rej;
  return promise;
};
const makeString = object => {
  if (object == null) return '';
  return '' + object;
};
const copy = (a, s, t) => {
  a.forEach(m => {
    if (s[m]) t[m] = s[m];
  });
};
const lastOfPathSeparatorRegExp = /###/g;
const cleanKey = key => key && key.indexOf('###') > -1 ? key.replace(lastOfPathSeparatorRegExp, '.') : key;
const canNotTraverseDeeper = object => !object || isString(object);
const getLastOfPath = (object, path, Empty) => {
  const stack = !isString(path) ? path : path.split('.');
  let stackIndex = 0;
  while (stackIndex < stack.length - 1) {
    if (canNotTraverseDeeper(object)) return {};
    const key = cleanKey(stack[stackIndex]);
    if (!object[key] && Empty) object[key] = new Empty();
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      object = object[key];
    } else {
      object = {};
    }
    ++stackIndex;
  }
  if (canNotTraverseDeeper(object)) return {};
  return {
    obj: object,
    k: cleanKey(stack[stackIndex])
  };
};
const setPath = (object, path, newValue) => {
  const {
    obj,
    k
  } = getLastOfPath(object, path, Object);
  if (obj !== undefined || path.length === 1) {
    obj[k] = newValue;
    return;
  }
  let e = path[path.length - 1];
  let p = path.slice(0, path.length - 1);
  let last = getLastOfPath(object, p, Object);
  while (last.obj === undefined && p.length) {
    e = `${p[p.length - 1]}.${e}`;
    p = p.slice(0, p.length - 1);
    last = getLastOfPath(object, p, Object);
    if (last?.obj && typeof last.obj[`${last.k}.${e}`] !== 'undefined') {
      last.obj = undefined;
    }
  }
  last.obj[`${last.k}.${e}`] = newValue;
};
const pushPath = (object, path, newValue, concat) => {
  const {
    obj,
    k
  } = getLastOfPath(object, path, Object);
  obj[k] = obj[k] || [];
  obj[k].push(newValue);
};
const getPath = (object, path) => {
  const {
    obj,
    k
  } = getLastOfPath(object, path);
  if (!obj) return undefined;
  if (!Object.prototype.hasOwnProperty.call(obj, k)) return undefined;
  return obj[k];
};
const getPathWithDefaults = (data, defaultData, key) => {
  const value = getPath(data, key);
  if (value !== undefined) {
    return value;
  }
  return getPath(defaultData, key);
};
const deepExtend = (target, source, overwrite) => {
  for (const prop in source) {
    if (prop !== '__proto__' && prop !== 'constructor') {
      if (prop in target) {
        if (isString(target[prop]) || target[prop] instanceof String || isString(source[prop]) || source[prop] instanceof String) {
          if (overwrite) target[prop] = source[prop];
        } else {
          deepExtend(target[prop], source[prop], overwrite);
        }
      } else {
        target[prop] = source[prop];
      }
    }
  }
  return target;
};
const regexEscape = str => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
var _entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;'
};
const escape = data => {
  if (isString(data)) {
    return data.replace(/[&<>"'\/]/g, s => _entityMap[s]);
  }
  return data;
};
class RegExpCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.regExpMap = new Map();
    this.regExpQueue = [];
  }
  getRegExp(pattern) {
    const regExpFromCache = this.regExpMap.get(pattern);
    if (regExpFromCache !== undefined) {
      return regExpFromCache;
    }
    const regExpNew = new RegExp(pattern);
    if (this.regExpQueue.length === this.capacity) {
      this.regExpMap.delete(this.regExpQueue.shift());
    }
    this.regExpMap.set(pattern, regExpNew);
    this.regExpQueue.push(pattern);
    return regExpNew;
  }
}
const chars = [' ', ',', '?', '!', ';'];
const looksLikeObjectPathRegExpCache = new RegExpCache(20);
const looksLikeObjectPath = (key, nsSeparator, keySeparator) => {
  nsSeparator = nsSeparator || '';
  keySeparator = keySeparator || '';
  const possibleChars = chars.filter(c => nsSeparator.indexOf(c) < 0 && keySeparator.indexOf(c) < 0);
  if (possibleChars.length === 0) return true;
  const r = looksLikeObjectPathRegExpCache.getRegExp(`(${possibleChars.map(c => c === '?' ? '\\?' : c).join('|')})`);
  let matched = !r.test(key);
  if (!matched) {
    const ki = key.indexOf(keySeparator);
    if (ki > 0 && !r.test(key.substring(0, ki))) {
      matched = true;
    }
  }
  return matched;
};
const deepFind = (obj, path, keySeparator = '.') => {
  if (!obj) return undefined;
  if (obj[path]) {
    if (!Object.prototype.hasOwnProperty.call(obj, path)) return undefined;
    return obj[path];
  }
  const tokens = path.split(keySeparator);
  let current = obj;
  for (let i = 0; i < tokens.length;) {
    if (!current || typeof current !== 'object') {
      return undefined;
    }
    let next;
    let nextPath = '';
    for (let j = i; j < tokens.length; ++j) {
      if (j !== i) {
        nextPath += keySeparator;
      }
      nextPath += tokens[j];
      next = current[nextPath];
      if (next !== undefined) {
        if (['string', 'number', 'boolean'].indexOf(typeof next) > -1 && j < tokens.length - 1) {
          continue;
        }
        i += j - i + 1;
        break;
      }
    }
    current = next;
  }
  return current;
};
const getCleanedCode = code => code?.replace('_', '-');

const consoleLogger = {
  type: 'logger',
  log(args) {
    this.output('log', args);
  },
  warn(args) {
    this.output('warn', args);
  },
  error(args) {
    this.output('error', args);
  },
  output(type, args) {
    console?.[type]?.apply?.(console, args);
  }
};
class Logger {
  constructor(concreteLogger, options = {}) {
    this.init(concreteLogger, options);
  }
  init(concreteLogger, options = {}) {
    this.prefix = options.prefix || 'i18next:';
    this.logger = concreteLogger || consoleLogger;
    this.options = options;
    this.debug = options.debug;
  }
  log(...args) {
    return this.forward(args, 'log', '', true);
  }
  warn(...args) {
    return this.forward(args, 'warn', '', true);
  }
  error(...args) {
    return this.forward(args, 'error', '');
  }
  deprecate(...args) {
    return this.forward(args, 'warn', 'WARNING DEPRECATED: ', true);
  }
  forward(args, lvl, prefix, debugOnly) {
    if (debugOnly && !this.debug) return null;
    if (isString(args[0])) args[0] = `${prefix}${this.prefix} ${args[0]}`;
    return this.logger[lvl](args);
  }
  create(moduleName) {
    return new Logger(this.logger, {
      ...{
        prefix: `${this.prefix}:${moduleName}:`
      },
      ...this.options
    });
  }
  clone(options) {
    options = options || this.options;
    options.prefix = options.prefix || this.prefix;
    return new Logger(this.logger, options);
  }
}
var baseLogger = new Logger();

class EventEmitter {
  constructor() {
    this.observers = {};
  }
  on(events, listener) {
    events.split(' ').forEach(event => {
      if (!this.observers[event]) this.observers[event] = new Map();
      const numListeners = this.observers[event].get(listener) || 0;
      this.observers[event].set(listener, numListeners + 1);
    });
    return this;
  }
  off(event, listener) {
    if (!this.observers[event]) return;
    if (!listener) {
      delete this.observers[event];
      return;
    }
    this.observers[event].delete(listener);
  }
  emit(event, ...args) {
    if (this.observers[event]) {
      const cloned = Array.from(this.observers[event].entries());
      cloned.forEach(([observer, numTimesAdded]) => {
        for (let i = 0; i < numTimesAdded; i++) {
          observer(...args);
        }
      });
    }
    if (this.observers['*']) {
      const cloned = Array.from(this.observers['*'].entries());
      cloned.forEach(([observer, numTimesAdded]) => {
        for (let i = 0; i < numTimesAdded; i++) {
          observer.apply(observer, [event, ...args]);
        }
      });
    }
  }
}

class ResourceStore extends EventEmitter {
  constructor(data, options = {
    ns: ['translation'],
    defaultNS: 'translation'
  }) {
    super();
    this.data = data || {};
    this.options = options;
    if (this.options.keySeparator === undefined) {
      this.options.keySeparator = '.';
    }
    if (this.options.ignoreJSONStructure === undefined) {
      this.options.ignoreJSONStructure = true;
    }
  }
  addNamespaces(ns) {
    if (this.options.ns.indexOf(ns) < 0) {
      this.options.ns.push(ns);
    }
  }
  removeNamespaces(ns) {
    const index = this.options.ns.indexOf(ns);
    if (index > -1) {
      this.options.ns.splice(index, 1);
    }
  }
  getResource(lng, ns, key, options = {}) {
    const keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
    const ignoreJSONStructure = options.ignoreJSONStructure !== undefined ? options.ignoreJSONStructure : this.options.ignoreJSONStructure;
    let path;
    if (lng.indexOf('.') > -1) {
      path = lng.split('.');
    } else {
      path = [lng, ns];
      if (key) {
        if (Array.isArray(key)) {
          path.push(...key);
        } else if (isString(key) && keySeparator) {
          path.push(...key.split(keySeparator));
        } else {
          path.push(key);
        }
      }
    }
    const result = getPath(this.data, path);
    if (!result && !ns && !key && lng.indexOf('.') > -1) {
      lng = path[0];
      ns = path[1];
      key = path.slice(2).join('.');
    }
    if (result || !ignoreJSONStructure || !isString(key)) return result;
    return deepFind(this.data?.[lng]?.[ns], key, keySeparator);
  }
  addResource(lng, ns, key, value, options = {
    silent: false
  }) {
    const keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
    let path = [lng, ns];
    if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);
    if (lng.indexOf('.') > -1) {
      path = lng.split('.');
      value = ns;
      ns = path[1];
    }
    this.addNamespaces(ns);
    setPath(this.data, path, value);
    if (!options.silent) this.emit('added', lng, ns, key, value);
  }
  addResources(lng, ns, resources, options = {
    silent: false
  }) {
    for (const m in resources) {
      if (isString(resources[m]) || Array.isArray(resources[m])) this.addResource(lng, ns, m, resources[m], {
        silent: true
      });
    }
    if (!options.silent) this.emit('added', lng, ns, resources);
  }
  addResourceBundle(lng, ns, resources, deep, overwrite, options = {
    silent: false,
    skipCopy: false
  }) {
    let path = [lng, ns];
    if (lng.indexOf('.') > -1) {
      path = lng.split('.');
      deep = resources;
      resources = ns;
      ns = path[1];
    }
    this.addNamespaces(ns);
    let pack = getPath(this.data, path) || {};
    if (!options.skipCopy) resources = JSON.parse(JSON.stringify(resources));
    if (deep) {
      deepExtend(pack, resources, overwrite);
    } else {
      pack = {
        ...pack,
        ...resources
      };
    }
    setPath(this.data, path, pack);
    if (!options.silent) this.emit('added', lng, ns, resources);
  }
  removeResourceBundle(lng, ns) {
    if (this.hasResourceBundle(lng, ns)) {
      delete this.data[lng][ns];
    }
    this.removeNamespaces(ns);
    this.emit('removed', lng, ns);
  }
  hasResourceBundle(lng, ns) {
    return this.getResource(lng, ns) !== undefined;
  }
  getResourceBundle(lng, ns) {
    if (!ns) ns = this.options.defaultNS;
    return this.getResource(lng, ns);
  }
  getDataByLanguage(lng) {
    return this.data[lng];
  }
  hasLanguageSomeTranslations(lng) {
    const data = this.getDataByLanguage(lng);
    const n = data && Object.keys(data) || [];
    return !!n.find(v => data[v] && Object.keys(data[v]).length > 0);
  }
  toJSON() {
    return this.data;
  }
}

var postProcessor = {
  processors: {},
  addPostProcessor(module) {
    this.processors[module.name] = module;
  },
  handle(processors, value, key, options, translator) {
    processors.forEach(processor => {
      value = this.processors[processor]?.process(value, key, options, translator) ?? value;
    });
    return value;
  }
};

const checkedLoadedFor = {};
const shouldHandleAsObject = res => !isString(res) && typeof res !== 'boolean' && typeof res !== 'number';
class Translator extends EventEmitter {
  constructor(services, options = {}) {
    super();
    copy(['resourceStore', 'languageUtils', 'pluralResolver', 'interpolator', 'backendConnector', 'i18nFormat', 'utils'], services, this);
    this.options = options;
    if (this.options.keySeparator === undefined) {
      this.options.keySeparator = '.';
    }
    this.logger = baseLogger.create('translator');
  }
  changeLanguage(lng) {
    if (lng) this.language = lng;
  }
  exists(key, o = {
    interpolation: {}
  }) {
    const opt = {
      ...o
    };
    if (key == null) return false;
    const resolved = this.resolve(key, opt);
    return resolved?.res !== undefined;
  }
  extractFromKey(key, opt) {
    let nsSeparator = opt.nsSeparator !== undefined ? opt.nsSeparator : this.options.nsSeparator;
    if (nsSeparator === undefined) nsSeparator = ':';
    const keySeparator = opt.keySeparator !== undefined ? opt.keySeparator : this.options.keySeparator;
    let namespaces = opt.ns || this.options.defaultNS || [];
    const wouldCheckForNsInKey = nsSeparator && key.indexOf(nsSeparator) > -1;
    const seemsNaturalLanguage = !this.options.userDefinedKeySeparator && !opt.keySeparator && !this.options.userDefinedNsSeparator && !opt.nsSeparator && !looksLikeObjectPath(key, nsSeparator, keySeparator);
    if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
      const m = key.match(this.interpolator.nestingRegexp);
      if (m && m.length > 0) {
        return {
          key,
          namespaces: isString(namespaces) ? [namespaces] : namespaces
        };
      }
      const parts = key.split(nsSeparator);
      if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1) namespaces = parts.shift();
      key = parts.join(keySeparator);
    }
    return {
      key,
      namespaces: isString(namespaces) ? [namespaces] : namespaces
    };
  }
  translate(keys, o, lastKey) {
    let opt = typeof o === 'object' ? {
      ...o
    } : o;
    if (typeof opt !== 'object' && this.options.overloadTranslationOptionHandler) {
      opt = this.options.overloadTranslationOptionHandler(arguments);
    }
    if (typeof options === 'object') opt = {
      ...opt
    };
    if (!opt) opt = {};
    if (keys == null) return '';
    if (!Array.isArray(keys)) keys = [String(keys)];
    const returnDetails = opt.returnDetails !== undefined ? opt.returnDetails : this.options.returnDetails;
    const keySeparator = opt.keySeparator !== undefined ? opt.keySeparator : this.options.keySeparator;
    const {
      key,
      namespaces
    } = this.extractFromKey(keys[keys.length - 1], opt);
    const namespace = namespaces[namespaces.length - 1];
    let nsSeparator = opt.nsSeparator !== undefined ? opt.nsSeparator : this.options.nsSeparator;
    if (nsSeparator === undefined) nsSeparator = ':';
    const lng = opt.lng || this.language;
    const appendNamespaceToCIMode = opt.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if (lng?.toLowerCase() === 'cimode') {
      if (appendNamespaceToCIMode) {
        if (returnDetails) {
          return {
            res: `${namespace}${nsSeparator}${key}`,
            usedKey: key,
            exactUsedKey: key,
            usedLng: lng,
            usedNS: namespace,
            usedParams: this.getUsedParamsDetails(opt)
          };
        }
        return `${namespace}${nsSeparator}${key}`;
      }
      if (returnDetails) {
        return {
          res: key,
          usedKey: key,
          exactUsedKey: key,
          usedLng: lng,
          usedNS: namespace,
          usedParams: this.getUsedParamsDetails(opt)
        };
      }
      return key;
    }
    const resolved = this.resolve(keys, opt);
    let res = resolved?.res;
    const resUsedKey = resolved?.usedKey || key;
    const resExactUsedKey = resolved?.exactUsedKey || key;
    const noObject = ['[object Number]', '[object Function]', '[object RegExp]'];
    const joinArrays = opt.joinArrays !== undefined ? opt.joinArrays : this.options.joinArrays;
    const handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
    const needsPluralHandling = opt.count !== undefined && !isString(opt.count);
    const hasDefaultValue = Translator.hasDefaultValue(opt);
    const defaultValueSuffix = needsPluralHandling ? this.pluralResolver.getSuffix(lng, opt.count, opt) : '';
    const defaultValueSuffixOrdinalFallback = opt.ordinal && needsPluralHandling ? this.pluralResolver.getSuffix(lng, opt.count, {
      ordinal: false
    }) : '';
    const needsZeroSuffixLookup = needsPluralHandling && !opt.ordinal && opt.count === 0;
    const defaultValue = needsZeroSuffixLookup && opt[`defaultValue${this.options.pluralSeparator}zero`] || opt[`defaultValue${defaultValueSuffix}`] || opt[`defaultValue${defaultValueSuffixOrdinalFallback}`] || opt.defaultValue;
    let resForObjHndl = res;
    if (handleAsObjectInI18nFormat && !res && hasDefaultValue) {
      resForObjHndl = defaultValue;
    }
    const handleAsObject = shouldHandleAsObject(resForObjHndl);
    const resType = Object.prototype.toString.apply(resForObjHndl);
    if (handleAsObjectInI18nFormat && resForObjHndl && handleAsObject && noObject.indexOf(resType) < 0 && !(isString(joinArrays) && Array.isArray(resForObjHndl))) {
      if (!opt.returnObjects && !this.options.returnObjects) {
        if (!this.options.returnedObjectHandler) {
          this.logger.warn('accessing an object - but returnObjects options is not enabled!');
        }
        const r = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, resForObjHndl, {
          ...opt,
          ns: namespaces
        }) : `key '${key} (${this.language})' returned an object instead of string.`;
        if (returnDetails) {
          resolved.res = r;
          resolved.usedParams = this.getUsedParamsDetails(opt);
          return resolved;
        }
        return r;
      }
      if (keySeparator) {
        const resTypeIsArray = Array.isArray(resForObjHndl);
        const copy = resTypeIsArray ? [] : {};
        const newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
        for (const m in resForObjHndl) {
          if (Object.prototype.hasOwnProperty.call(resForObjHndl, m)) {
            const deepKey = `${newKeyToUse}${keySeparator}${m}`;
            if (hasDefaultValue && !res) {
              copy[m] = this.translate(deepKey, {
                ...opt,
                defaultValue: shouldHandleAsObject(defaultValue) ? defaultValue[m] : undefined,
                ...{
                  joinArrays: false,
                  ns: namespaces
                }
              });
            } else {
              copy[m] = this.translate(deepKey, {
                ...opt,
                ...{
                  joinArrays: false,
                  ns: namespaces
                }
              });
            }
            if (copy[m] === deepKey) copy[m] = resForObjHndl[m];
          }
        }
        res = copy;
      }
    } else if (handleAsObjectInI18nFormat && isString(joinArrays) && Array.isArray(res)) {
      res = res.join(joinArrays);
      if (res) res = this.extendTranslation(res, keys, opt, lastKey);
    } else {
      let usedDefault = false;
      let usedKey = false;
      if (!this.isValidLookup(res) && hasDefaultValue) {
        usedDefault = true;
        res = defaultValue;
      }
      if (!this.isValidLookup(res)) {
        usedKey = true;
        res = key;
      }
      const missingKeyNoValueFallbackToKey = opt.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey;
      const resForMissing = missingKeyNoValueFallbackToKey && usedKey ? undefined : res;
      const updateMissing = hasDefaultValue && defaultValue !== res && this.options.updateMissing;
      if (usedKey || usedDefault || updateMissing) {
        this.logger.log(updateMissing ? 'updateKey' : 'missingKey', lng, namespace, key, updateMissing ? defaultValue : res);
        if (keySeparator) {
          const fk = this.resolve(key, {
            ...opt,
            keySeparator: false
          });
          if (fk && fk.res) this.logger.warn('Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.');
        }
        let lngs = [];
        const fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, opt.lng || this.language);
        if (this.options.saveMissingTo === 'fallback' && fallbackLngs && fallbackLngs[0]) {
          for (let i = 0; i < fallbackLngs.length; i++) {
            lngs.push(fallbackLngs[i]);
          }
        } else if (this.options.saveMissingTo === 'all') {
          lngs = this.languageUtils.toResolveHierarchy(opt.lng || this.language);
        } else {
          lngs.push(opt.lng || this.language);
        }
        const send = (l, k, specificDefaultValue) => {
          const defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;
          if (this.options.missingKeyHandler) {
            this.options.missingKeyHandler(l, namespace, k, defaultForMissing, updateMissing, opt);
          } else if (this.backendConnector?.saveMissing) {
            this.backendConnector.saveMissing(l, namespace, k, defaultForMissing, updateMissing, opt);
          }
          this.emit('missingKey', l, namespace, k, res);
        };
        if (this.options.saveMissing) {
          if (this.options.saveMissingPlurals && needsPluralHandling) {
            lngs.forEach(language => {
              const suffixes = this.pluralResolver.getSuffixes(language, opt);
              if (needsZeroSuffixLookup && opt[`defaultValue${this.options.pluralSeparator}zero`] && suffixes.indexOf(`${this.options.pluralSeparator}zero`) < 0) {
                suffixes.push(`${this.options.pluralSeparator}zero`);
              }
              suffixes.forEach(suffix => {
                send([language], key + suffix, opt[`defaultValue${suffix}`] || defaultValue);
              });
            });
          } else {
            send(lngs, key, defaultValue);
          }
        }
      }
      res = this.extendTranslation(res, keys, opt, resolved, lastKey);
      if (usedKey && res === key && this.options.appendNamespaceToMissingKey) {
        res = `${namespace}${nsSeparator}${key}`;
      }
      if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) {
        res = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${namespace}${nsSeparator}${key}` : key, usedDefault ? res : undefined, opt);
      }
    }
    if (returnDetails) {
      resolved.res = res;
      resolved.usedParams = this.getUsedParamsDetails(opt);
      return resolved;
    }
    return res;
  }
  extendTranslation(res, key, opt, resolved, lastKey) {
    if (this.i18nFormat?.parse) {
      res = this.i18nFormat.parse(res, {
        ...this.options.interpolation.defaultVariables,
        ...opt
      }, opt.lng || this.language || resolved.usedLng, resolved.usedNS, resolved.usedKey, {
        resolved
      });
    } else if (!opt.skipInterpolation) {
      if (opt.interpolation) this.interpolator.init({
        ...opt,
        ...{
          interpolation: {
            ...this.options.interpolation,
            ...opt.interpolation
          }
        }
      });
      const skipOnVariables = isString(res) && (opt?.interpolation?.skipOnVariables !== undefined ? opt.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
      let nestBef;
      if (skipOnVariables) {
        const nb = res.match(this.interpolator.nestingRegexp);
        nestBef = nb && nb.length;
      }
      let data = opt.replace && !isString(opt.replace) ? opt.replace : opt;
      if (this.options.interpolation.defaultVariables) data = {
        ...this.options.interpolation.defaultVariables,
        ...data
      };
      res = this.interpolator.interpolate(res, data, opt.lng || this.language || resolved.usedLng, opt);
      if (skipOnVariables) {
        const na = res.match(this.interpolator.nestingRegexp);
        const nestAft = na && na.length;
        if (nestBef < nestAft) opt.nest = false;
      }
      if (!opt.lng && resolved && resolved.res) opt.lng = this.language || resolved.usedLng;
      if (opt.nest !== false) res = this.interpolator.nest(res, (...args) => {
        if (lastKey?.[0] === args[0] && !opt.context) {
          this.logger.warn(`It seems you are nesting recursively key: ${args[0]} in key: ${key[0]}`);
          return null;
        }
        return this.translate(...args, key);
      }, opt);
      if (opt.interpolation) this.interpolator.reset();
    }
    const postProcess = opt.postProcess || this.options.postProcess;
    const postProcessorNames = isString(postProcess) ? [postProcess] : postProcess;
    if (res != null && postProcessorNames?.length && opt.applyPostProcessor !== false) {
      res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? {
        i18nResolved: {
          ...resolved,
          usedParams: this.getUsedParamsDetails(opt)
        },
        ...opt
      } : opt, this);
    }
    return res;
  }
  resolve(keys, opt = {}) {
    let found;
    let usedKey;
    let exactUsedKey;
    let usedLng;
    let usedNS;
    if (isString(keys)) keys = [keys];
    keys.forEach(k => {
      if (this.isValidLookup(found)) return;
      const extracted = this.extractFromKey(k, opt);
      const key = extracted.key;
      usedKey = key;
      let namespaces = extracted.namespaces;
      if (this.options.fallbackNS) namespaces = namespaces.concat(this.options.fallbackNS);
      const needsPluralHandling = opt.count !== undefined && !isString(opt.count);
      const needsZeroSuffixLookup = needsPluralHandling && !opt.ordinal && opt.count === 0;
      const needsContextHandling = opt.context !== undefined && (isString(opt.context) || typeof opt.context === 'number') && opt.context !== '';
      const codes = opt.lngs ? opt.lngs : this.languageUtils.toResolveHierarchy(opt.lng || this.language, opt.fallbackLng);
      namespaces.forEach(ns => {
        if (this.isValidLookup(found)) return;
        usedNS = ns;
        if (!checkedLoadedFor[`${codes[0]}-${ns}`] && this.utils?.hasLoadedNamespace && !this.utils?.hasLoadedNamespace(usedNS)) {
          checkedLoadedFor[`${codes[0]}-${ns}`] = true;
          this.logger.warn(`key "${usedKey}" for languages "${codes.join(', ')}" won't get resolved as namespace "${usedNS}" was not yet loaded`, 'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!');
        }
        codes.forEach(code => {
          if (this.isValidLookup(found)) return;
          usedLng = code;
          const finalKeys = [key];
          if (this.i18nFormat?.addLookupKeys) {
            this.i18nFormat.addLookupKeys(finalKeys, key, code, ns, opt);
          } else {
            let pluralSuffix;
            if (needsPluralHandling) pluralSuffix = this.pluralResolver.getSuffix(code, opt.count, opt);
            const zeroSuffix = `${this.options.pluralSeparator}zero`;
            const ordinalPrefix = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
            if (needsPluralHandling) {
              finalKeys.push(key + pluralSuffix);
              if (opt.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                finalKeys.push(key + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
              }
              if (needsZeroSuffixLookup) {
                finalKeys.push(key + zeroSuffix);
              }
            }
            if (needsContextHandling) {
              const contextKey = `${key}${this.options.contextSeparator}${opt.context}`;
              finalKeys.push(contextKey);
              if (needsPluralHandling) {
                finalKeys.push(contextKey + pluralSuffix);
                if (opt.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                  finalKeys.push(contextKey + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
                }
                if (needsZeroSuffixLookup) {
                  finalKeys.push(contextKey + zeroSuffix);
                }
              }
            }
          }
          let possibleKey;
          while (possibleKey = finalKeys.pop()) {
            if (!this.isValidLookup(found)) {
              exactUsedKey = possibleKey;
              found = this.getResource(code, ns, possibleKey, opt);
            }
          }
        });
      });
    });
    return {
      res: found,
      usedKey,
      exactUsedKey,
      usedLng,
      usedNS
    };
  }
  isValidLookup(res) {
    return res !== undefined && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === '');
  }
  getResource(code, ns, key, options = {}) {
    if (this.i18nFormat?.getResource) return this.i18nFormat.getResource(code, ns, key, options);
    return this.resourceStore.getResource(code, ns, key, options);
  }
  getUsedParamsDetails(options = {}) {
    const optionsKeys = ['defaultValue', 'ordinal', 'context', 'replace', 'lng', 'lngs', 'fallbackLng', 'ns', 'keySeparator', 'nsSeparator', 'returnObjects', 'returnDetails', 'joinArrays', 'postProcess', 'interpolation'];
    const useOptionsReplaceForData = options.replace && !isString(options.replace);
    let data = useOptionsReplaceForData ? options.replace : options;
    if (useOptionsReplaceForData && typeof options.count !== 'undefined') {
      data.count = options.count;
    }
    if (this.options.interpolation.defaultVariables) {
      data = {
        ...this.options.interpolation.defaultVariables,
        ...data
      };
    }
    if (!useOptionsReplaceForData) {
      data = {
        ...data
      };
      for (const key of optionsKeys) {
        delete data[key];
      }
    }
    return data;
  }
  static hasDefaultValue(options) {
    const prefix = 'defaultValue';
    for (const option in options) {
      if (Object.prototype.hasOwnProperty.call(options, option) && prefix === option.substring(0, prefix.length) && undefined !== options[option]) {
        return true;
      }
    }
    return false;
  }
}

class LanguageUtil {
  constructor(options) {
    this.options = options;
    this.supportedLngs = this.options.supportedLngs || false;
    this.logger = baseLogger.create('languageUtils');
  }
  getScriptPartFromCode(code) {
    code = getCleanedCode(code);
    if (!code || code.indexOf('-') < 0) return null;
    const p = code.split('-');
    if (p.length === 2) return null;
    p.pop();
    if (p[p.length - 1].toLowerCase() === 'x') return null;
    return this.formatLanguageCode(p.join('-'));
  }
  getLanguagePartFromCode(code) {
    code = getCleanedCode(code);
    if (!code || code.indexOf('-') < 0) return code;
    const p = code.split('-');
    return this.formatLanguageCode(p[0]);
  }
  formatLanguageCode(code) {
    if (isString(code) && code.indexOf('-') > -1) {
      let formattedCode;
      try {
        formattedCode = Intl.getCanonicalLocales(code)[0];
      } catch (e) {}
      if (formattedCode && this.options.lowerCaseLng) {
        formattedCode = formattedCode.toLowerCase();
      }
      if (formattedCode) return formattedCode;
      if (this.options.lowerCaseLng) {
        return code.toLowerCase();
      }
      return code;
    }
    return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
  }
  isSupportedCode(code) {
    if (this.options.load === 'languageOnly' || this.options.nonExplicitSupportedLngs) {
      code = this.getLanguagePartFromCode(code);
    }
    return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(code) > -1;
  }
  getBestMatchFromCodes(codes) {
    if (!codes) return null;
    let found;
    codes.forEach(code => {
      if (found) return;
      const cleanedLng = this.formatLanguageCode(code);
      if (!this.options.supportedLngs || this.isSupportedCode(cleanedLng)) found = cleanedLng;
    });
    if (!found && this.options.supportedLngs) {
      codes.forEach(code => {
        if (found) return;
        const lngScOnly = this.getScriptPartFromCode(code);
        if (this.isSupportedCode(lngScOnly)) return found = lngScOnly;
        const lngOnly = this.getLanguagePartFromCode(code);
        if (this.isSupportedCode(lngOnly)) return found = lngOnly;
        found = this.options.supportedLngs.find(supportedLng => {
          if (supportedLng === lngOnly) return supportedLng;
          if (supportedLng.indexOf('-') < 0 && lngOnly.indexOf('-') < 0) return;
          if (supportedLng.indexOf('-') > 0 && lngOnly.indexOf('-') < 0 && supportedLng.substring(0, supportedLng.indexOf('-')) === lngOnly) return supportedLng;
          if (supportedLng.indexOf(lngOnly) === 0 && lngOnly.length > 1) return supportedLng;
        });
      });
    }
    if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
    return found;
  }
  getFallbackCodes(fallbacks, code) {
    if (!fallbacks) return [];
    if (typeof fallbacks === 'function') fallbacks = fallbacks(code);
    if (isString(fallbacks)) fallbacks = [fallbacks];
    if (Array.isArray(fallbacks)) return fallbacks;
    if (!code) return fallbacks.default || [];
    let found = fallbacks[code];
    if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
    if (!found) found = fallbacks[this.formatLanguageCode(code)];
    if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
    if (!found) found = fallbacks.default;
    return found || [];
  }
  toResolveHierarchy(code, fallbackCode) {
    const fallbackCodes = this.getFallbackCodes((fallbackCode === false ? [] : fallbackCode) || this.options.fallbackLng || [], code);
    const codes = [];
    const addCode = c => {
      if (!c) return;
      if (this.isSupportedCode(c)) {
        codes.push(c);
      } else {
        this.logger.warn(`rejecting language code not found in supportedLngs: ${c}`);
      }
    };
    if (isString(code) && (code.indexOf('-') > -1 || code.indexOf('_') > -1)) {
      if (this.options.load !== 'languageOnly') addCode(this.formatLanguageCode(code));
      if (this.options.load !== 'languageOnly' && this.options.load !== 'currentOnly') addCode(this.getScriptPartFromCode(code));
      if (this.options.load !== 'currentOnly') addCode(this.getLanguagePartFromCode(code));
    } else if (isString(code)) {
      addCode(this.formatLanguageCode(code));
    }
    fallbackCodes.forEach(fc => {
      if (codes.indexOf(fc) < 0) addCode(this.formatLanguageCode(fc));
    });
    return codes;
  }
}

const suffixesOrder = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
};
const dummyRule = {
  select: count => count === 1 ? 'one' : 'other',
  resolvedOptions: () => ({
    pluralCategories: ['one', 'other']
  })
};
class PluralResolver {
  constructor(languageUtils, options = {}) {
    this.languageUtils = languageUtils;
    this.options = options;
    this.logger = baseLogger.create('pluralResolver');
    this.pluralRulesCache = {};
  }
  addRule(lng, obj) {
    this.rules[lng] = obj;
  }
  clearCache() {
    this.pluralRulesCache = {};
  }
  getRule(code, options = {}) {
    const cleanedCode = getCleanedCode(code === 'dev' ? 'en' : code);
    const type = options.ordinal ? 'ordinal' : 'cardinal';
    const cacheKey = JSON.stringify({
      cleanedCode,
      type
    });
    if (cacheKey in this.pluralRulesCache) {
      return this.pluralRulesCache[cacheKey];
    }
    let rule;
    try {
      rule = new Intl.PluralRules(cleanedCode, {
        type
      });
    } catch (err) {
      if (!Intl) {
        this.logger.error('No Intl support, please use an Intl polyfill!');
        return dummyRule;
      }
      if (!code.match(/-|_/)) return dummyRule;
      const lngPart = this.languageUtils.getLanguagePartFromCode(code);
      rule = this.getRule(lngPart, options);
    }
    this.pluralRulesCache[cacheKey] = rule;
    return rule;
  }
  needsPlural(code, options = {}) {
    let rule = this.getRule(code, options);
    if (!rule) rule = this.getRule('dev', options);
    return rule?.resolvedOptions().pluralCategories.length > 1;
  }
  getPluralFormsOfKey(code, key, options = {}) {
    return this.getSuffixes(code, options).map(suffix => `${key}${suffix}`);
  }
  getSuffixes(code, options = {}) {
    let rule = this.getRule(code, options);
    if (!rule) rule = this.getRule('dev', options);
    if (!rule) return [];
    return rule.resolvedOptions().pluralCategories.sort((pluralCategory1, pluralCategory2) => suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2]).map(pluralCategory => `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ''}${pluralCategory}`);
  }
  getSuffix(code, count, options = {}) {
    const rule = this.getRule(code, options);
    if (rule) {
      return `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ''}${rule.select(count)}`;
    }
    this.logger.warn(`no plural rule found for: ${code}`);
    return this.getSuffix('dev', count, options);
  }
}

const deepFindWithDefaults = (data, defaultData, key, keySeparator = '.', ignoreJSONStructure = true) => {
  let path = getPathWithDefaults(data, defaultData, key);
  if (!path && ignoreJSONStructure && isString(key)) {
    path = deepFind(data, key, keySeparator);
    if (path === undefined) path = deepFind(defaultData, key, keySeparator);
  }
  return path;
};
const regexSafe = val => val.replace(/\$/g, '$$$$');
class Interpolator {
  constructor(options = {}) {
    this.logger = baseLogger.create('interpolator');
    this.options = options;
    this.format = options?.interpolation?.format || (value => value);
    this.init(options);
  }
  init(options = {}) {
    if (!options.interpolation) options.interpolation = {
      escapeValue: true
    };
    const {
      escape: escape$1,
      escapeValue,
      useRawValueToEscape,
      prefix,
      prefixEscaped,
      suffix,
      suffixEscaped,
      formatSeparator,
      unescapeSuffix,
      unescapePrefix,
      nestingPrefix,
      nestingPrefixEscaped,
      nestingSuffix,
      nestingSuffixEscaped,
      nestingOptionsSeparator,
      maxReplaces,
      alwaysFormat
    } = options.interpolation;
    this.escape = escape$1 !== undefined ? escape$1 : escape;
    this.escapeValue = escapeValue !== undefined ? escapeValue : true;
    this.useRawValueToEscape = useRawValueToEscape !== undefined ? useRawValueToEscape : false;
    this.prefix = prefix ? regexEscape(prefix) : prefixEscaped || '{{';
    this.suffix = suffix ? regexEscape(suffix) : suffixEscaped || '}}';
    this.formatSeparator = formatSeparator || ',';
    this.unescapePrefix = unescapeSuffix ? '' : unescapePrefix || '-';
    this.unescapeSuffix = this.unescapePrefix ? '' : unescapeSuffix || '';
    this.nestingPrefix = nestingPrefix ? regexEscape(nestingPrefix) : nestingPrefixEscaped || regexEscape('$t(');
    this.nestingSuffix = nestingSuffix ? regexEscape(nestingSuffix) : nestingSuffixEscaped || regexEscape(')');
    this.nestingOptionsSeparator = nestingOptionsSeparator || ',';
    this.maxReplaces = maxReplaces || 1000;
    this.alwaysFormat = alwaysFormat !== undefined ? alwaysFormat : false;
    this.resetRegExp();
  }
  reset() {
    if (this.options) this.init(this.options);
  }
  resetRegExp() {
    const getOrResetRegExp = (existingRegExp, pattern) => {
      if (existingRegExp?.source === pattern) {
        existingRegExp.lastIndex = 0;
        return existingRegExp;
      }
      return new RegExp(pattern, 'g');
    };
    this.regexp = getOrResetRegExp(this.regexp, `${this.prefix}(.+?)${this.suffix}`);
    this.regexpUnescape = getOrResetRegExp(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`);
    this.nestingRegexp = getOrResetRegExp(this.nestingRegexp, `${this.nestingPrefix}(.+?)${this.nestingSuffix}`);
  }
  interpolate(str, data, lng, options) {
    let match;
    let value;
    let replaces;
    const defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};
    const handleFormat = key => {
      if (key.indexOf(this.formatSeparator) < 0) {
        const path = deepFindWithDefaults(data, defaultData, key, this.options.keySeparator, this.options.ignoreJSONStructure);
        return this.alwaysFormat ? this.format(path, undefined, lng, {
          ...options,
          ...data,
          interpolationkey: key
        }) : path;
      }
      const p = key.split(this.formatSeparator);
      const k = p.shift().trim();
      const f = p.join(this.formatSeparator).trim();
      return this.format(deepFindWithDefaults(data, defaultData, k, this.options.keySeparator, this.options.ignoreJSONStructure), f, lng, {
        ...options,
        ...data,
        interpolationkey: k
      });
    };
    this.resetRegExp();
    const missingInterpolationHandler = options?.missingInterpolationHandler || this.options.missingInterpolationHandler;
    const skipOnVariables = options?.interpolation?.skipOnVariables !== undefined ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
    const todos = [{
      regex: this.regexpUnescape,
      safeValue: val => regexSafe(val)
    }, {
      regex: this.regexp,
      safeValue: val => this.escapeValue ? regexSafe(this.escape(val)) : regexSafe(val)
    }];
    todos.forEach(todo => {
      replaces = 0;
      while (match = todo.regex.exec(str)) {
        const matchedVar = match[1].trim();
        value = handleFormat(matchedVar);
        if (value === undefined) {
          if (typeof missingInterpolationHandler === 'function') {
            const temp = missingInterpolationHandler(str, match, options);
            value = isString(temp) ? temp : '';
          } else if (options && Object.prototype.hasOwnProperty.call(options, matchedVar)) {
            value = '';
          } else if (skipOnVariables) {
            value = match[0];
            continue;
          } else {
            this.logger.warn(`missed to pass in variable ${matchedVar} for interpolating ${str}`);
            value = '';
          }
        } else if (!isString(value) && !this.useRawValueToEscape) {
          value = makeString(value);
        }
        const safeValue = todo.safeValue(value);
        str = str.replace(match[0], safeValue);
        if (skipOnVariables) {
          todo.regex.lastIndex += value.length;
          todo.regex.lastIndex -= match[0].length;
        } else {
          todo.regex.lastIndex = 0;
        }
        replaces++;
        if (replaces >= this.maxReplaces) {
          break;
        }
      }
    });
    return str;
  }
  nest(str, fc, options = {}) {
    let match;
    let value;
    let clonedOptions;
    const handleHasOptions = (key, inheritedOptions) => {
      const sep = this.nestingOptionsSeparator;
      if (key.indexOf(sep) < 0) return key;
      const c = key.split(new RegExp(`${sep}[ ]*{`));
      let optionsString = `{${c[1]}`;
      key = c[0];
      optionsString = this.interpolate(optionsString, clonedOptions);
      const matchedSingleQuotes = optionsString.match(/'/g);
      const matchedDoubleQuotes = optionsString.match(/"/g);
      if ((matchedSingleQuotes?.length ?? 0) % 2 === 0 && !matchedDoubleQuotes || matchedDoubleQuotes.length % 2 !== 0) {
        optionsString = optionsString.replace(/'/g, '"');
      }
      try {
        clonedOptions = JSON.parse(optionsString);
        if (inheritedOptions) clonedOptions = {
          ...inheritedOptions,
          ...clonedOptions
        };
      } catch (e) {
        this.logger.warn(`failed parsing options string in nesting for key ${key}`, e);
        return `${key}${sep}${optionsString}`;
      }
      if (clonedOptions.defaultValue && clonedOptions.defaultValue.indexOf(this.prefix) > -1) delete clonedOptions.defaultValue;
      return key;
    };
    while (match = this.nestingRegexp.exec(str)) {
      let formatters = [];
      clonedOptions = {
        ...options
      };
      clonedOptions = clonedOptions.replace && !isString(clonedOptions.replace) ? clonedOptions.replace : clonedOptions;
      clonedOptions.applyPostProcessor = false;
      delete clonedOptions.defaultValue;
      const keyEndIndex = /{.*}/.test(match[1]) ? match[1].lastIndexOf('}') + 1 : match[1].indexOf(this.formatSeparator);
      if (keyEndIndex !== -1) {
        formatters = match[1].slice(keyEndIndex).split(this.formatSeparator).map(elem => elem.trim()).filter(Boolean);
        match[1] = match[1].slice(0, keyEndIndex);
      }
      value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
      if (value && match[0] === str && !isString(value)) return value;
      if (!isString(value)) value = makeString(value);
      if (!value) {
        this.logger.warn(`missed to resolve ${match[1]} for nesting ${str}`);
        value = '';
      }
      if (formatters.length) {
        value = formatters.reduce((v, f) => this.format(v, f, options.lng, {
          ...options,
          interpolationkey: match[1].trim()
        }), value.trim());
      }
      str = str.replace(match[0], value);
      this.regexp.lastIndex = 0;
    }
    return str;
  }
}

const parseFormatStr = formatStr => {
  let formatName = formatStr.toLowerCase().trim();
  const formatOptions = {};
  if (formatStr.indexOf('(') > -1) {
    const p = formatStr.split('(');
    formatName = p[0].toLowerCase().trim();
    const optStr = p[1].substring(0, p[1].length - 1);
    if (formatName === 'currency' && optStr.indexOf(':') < 0) {
      if (!formatOptions.currency) formatOptions.currency = optStr.trim();
    } else if (formatName === 'relativetime' && optStr.indexOf(':') < 0) {
      if (!formatOptions.range) formatOptions.range = optStr.trim();
    } else {
      const opts = optStr.split(';');
      opts.forEach(opt => {
        if (opt) {
          const [key, ...rest] = opt.split(':');
          const val = rest.join(':').trim().replace(/^'+|'+$/g, '');
          const trimmedKey = key.trim();
          if (!formatOptions[trimmedKey]) formatOptions[trimmedKey] = val;
          if (val === 'false') formatOptions[trimmedKey] = false;
          if (val === 'true') formatOptions[trimmedKey] = true;
          if (!isNaN(val)) formatOptions[trimmedKey] = parseInt(val, 10);
        }
      });
    }
  }
  return {
    formatName,
    formatOptions
  };
};
const createCachedFormatter = fn => {
  const cache = {};
  return (v, l, o) => {
    let optForCache = o;
    if (o && o.interpolationkey && o.formatParams && o.formatParams[o.interpolationkey] && o[o.interpolationkey]) {
      optForCache = {
        ...optForCache,
        [o.interpolationkey]: undefined
      };
    }
    const key = l + JSON.stringify(optForCache);
    let frm = cache[key];
    if (!frm) {
      frm = fn(getCleanedCode(l), o);
      cache[key] = frm;
    }
    return frm(v);
  };
};
const createNonCachedFormatter = fn => (v, l, o) => fn(getCleanedCode(l), o)(v);
class Formatter {
  constructor(options = {}) {
    this.logger = baseLogger.create('formatter');
    this.options = options;
    this.init(options);
  }
  init(services, options = {
    interpolation: {}
  }) {
    this.formatSeparator = options.interpolation.formatSeparator || ',';
    const cf = options.cacheInBuiltFormats ? createCachedFormatter : createNonCachedFormatter;
    this.formats = {
      number: cf((lng, opt) => {
        const formatter = new Intl.NumberFormat(lng, {
          ...opt
        });
        return val => formatter.format(val);
      }),
      currency: cf((lng, opt) => {
        const formatter = new Intl.NumberFormat(lng, {
          ...opt,
          style: 'currency'
        });
        return val => formatter.format(val);
      }),
      datetime: cf((lng, opt) => {
        const formatter = new Intl.DateTimeFormat(lng, {
          ...opt
        });
        return val => formatter.format(val);
      }),
      relativetime: cf((lng, opt) => {
        const formatter = new Intl.RelativeTimeFormat(lng, {
          ...opt
        });
        return val => formatter.format(val, opt.range || 'day');
      }),
      list: cf((lng, opt) => {
        const formatter = new Intl.ListFormat(lng, {
          ...opt
        });
        return val => formatter.format(val);
      })
    };
  }
  add(name, fc) {
    this.formats[name.toLowerCase().trim()] = fc;
  }
  addCached(name, fc) {
    this.formats[name.toLowerCase().trim()] = createCachedFormatter(fc);
  }
  format(value, format, lng, options = {}) {
    const formats = format.split(this.formatSeparator);
    if (formats.length > 1 && formats[0].indexOf('(') > 1 && formats[0].indexOf(')') < 0 && formats.find(f => f.indexOf(')') > -1)) {
      const lastIndex = formats.findIndex(f => f.indexOf(')') > -1);
      formats[0] = [formats[0], ...formats.splice(1, lastIndex)].join(this.formatSeparator);
    }
    const result = formats.reduce((mem, f) => {
      const {
        formatName,
        formatOptions
      } = parseFormatStr(f);
      if (this.formats[formatName]) {
        let formatted = mem;
        try {
          const valOptions = options?.formatParams?.[options.interpolationkey] || {};
          const l = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
          formatted = this.formats[formatName](mem, l, {
            ...formatOptions,
            ...options,
            ...valOptions
          });
        } catch (error) {
          this.logger.warn(error);
        }
        return formatted;
      } else {
        this.logger.warn(`there was no format function for ${formatName}`);
      }
      return mem;
    }, value);
    return result;
  }
}

const removePending = (q, name) => {
  if (q.pending[name] !== undefined) {
    delete q.pending[name];
    q.pendingCount--;
  }
};
class Connector extends EventEmitter {
  constructor(backend, store, services, options = {}) {
    super();
    this.backend = backend;
    this.store = store;
    this.services = services;
    this.languageUtils = services.languageUtils;
    this.options = options;
    this.logger = baseLogger.create('backendConnector');
    this.waitingReads = [];
    this.maxParallelReads = options.maxParallelReads || 10;
    this.readingCalls = 0;
    this.maxRetries = options.maxRetries >= 0 ? options.maxRetries : 5;
    this.retryTimeout = options.retryTimeout >= 1 ? options.retryTimeout : 350;
    this.state = {};
    this.queue = [];
    this.backend?.init?.(services, options.backend, options);
  }
  queueLoad(languages, namespaces, options, callback) {
    const toLoad = {};
    const pending = {};
    const toLoadLanguages = {};
    const toLoadNamespaces = {};
    languages.forEach(lng => {
      let hasAllNamespaces = true;
      namespaces.forEach(ns => {
        const name = `${lng}|${ns}`;
        if (!options.reload && this.store.hasResourceBundle(lng, ns)) {
          this.state[name] = 2;
        } else if (this.state[name] < 0) ; else if (this.state[name] === 1) {
          if (pending[name] === undefined) pending[name] = true;
        } else {
          this.state[name] = 1;
          hasAllNamespaces = false;
          if (pending[name] === undefined) pending[name] = true;
          if (toLoad[name] === undefined) toLoad[name] = true;
          if (toLoadNamespaces[ns] === undefined) toLoadNamespaces[ns] = true;
        }
      });
      if (!hasAllNamespaces) toLoadLanguages[lng] = true;
    });
    if (Object.keys(toLoad).length || Object.keys(pending).length) {
      this.queue.push({
        pending,
        pendingCount: Object.keys(pending).length,
        loaded: {},
        errors: [],
        callback
      });
    }
    return {
      toLoad: Object.keys(toLoad),
      pending: Object.keys(pending),
      toLoadLanguages: Object.keys(toLoadLanguages),
      toLoadNamespaces: Object.keys(toLoadNamespaces)
    };
  }
  loaded(name, err, data) {
    const s = name.split('|');
    const lng = s[0];
    const ns = s[1];
    if (err) this.emit('failedLoading', lng, ns, err);
    if (!err && data) {
      this.store.addResourceBundle(lng, ns, data, undefined, undefined, {
        skipCopy: true
      });
    }
    this.state[name] = err ? -1 : 2;
    if (err && data) this.state[name] = 0;
    const loaded = {};
    this.queue.forEach(q => {
      pushPath(q.loaded, [lng], ns);
      removePending(q, name);
      if (err) q.errors.push(err);
      if (q.pendingCount === 0 && !q.done) {
        Object.keys(q.loaded).forEach(l => {
          if (!loaded[l]) loaded[l] = {};
          const loadedKeys = q.loaded[l];
          if (loadedKeys.length) {
            loadedKeys.forEach(n => {
              if (loaded[l][n] === undefined) loaded[l][n] = true;
            });
          }
        });
        q.done = true;
        if (q.errors.length) {
          q.callback(q.errors);
        } else {
          q.callback();
        }
      }
    });
    this.emit('loaded', loaded);
    this.queue = this.queue.filter(q => !q.done);
  }
  read(lng, ns, fcName, tried = 0, wait = this.retryTimeout, callback) {
    if (!lng.length) return callback(null, {});
    if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({
        lng,
        ns,
        fcName,
        tried,
        wait,
        callback
      });
      return;
    }
    this.readingCalls++;
    const resolver = (err, data) => {
      this.readingCalls--;
      if (this.waitingReads.length > 0) {
        const next = this.waitingReads.shift();
        this.read(next.lng, next.ns, next.fcName, next.tried, next.wait, next.callback);
      }
      if (err && data && tried < this.maxRetries) {
        setTimeout(() => {
          this.read.call(this, lng, ns, fcName, tried + 1, wait * 2, callback);
        }, wait);
        return;
      }
      callback(err, data);
    };
    const fc = this.backend[fcName].bind(this.backend);
    if (fc.length === 2) {
      try {
        const r = fc(lng, ns);
        if (r && typeof r.then === 'function') {
          r.then(data => resolver(null, data)).catch(resolver);
        } else {
          resolver(null, r);
        }
      } catch (err) {
        resolver(err);
      }
      return;
    }
    return fc(lng, ns, resolver);
  }
  prepareLoading(languages, namespaces, options = {}, callback) {
    if (!this.backend) {
      this.logger.warn('No backend was added via i18next.use. Will not load resources.');
      return callback && callback();
    }
    if (isString(languages)) languages = this.languageUtils.toResolveHierarchy(languages);
    if (isString(namespaces)) namespaces = [namespaces];
    const toLoad = this.queueLoad(languages, namespaces, options, callback);
    if (!toLoad.toLoad.length) {
      if (!toLoad.pending.length) callback();
      return null;
    }
    toLoad.toLoad.forEach(name => {
      this.loadOne(name);
    });
  }
  load(languages, namespaces, callback) {
    this.prepareLoading(languages, namespaces, {}, callback);
  }
  reload(languages, namespaces, callback) {
    this.prepareLoading(languages, namespaces, {
      reload: true
    }, callback);
  }
  loadOne(name, prefix = '') {
    const s = name.split('|');
    const lng = s[0];
    const ns = s[1];
    this.read(lng, ns, 'read', undefined, undefined, (err, data) => {
      if (err) this.logger.warn(`${prefix}loading namespace ${ns} for language ${lng} failed`, err);
      if (!err && data) this.logger.log(`${prefix}loaded namespace ${ns} for language ${lng}`, data);
      this.loaded(name, err, data);
    });
  }
  saveMissing(languages, namespace, key, fallbackValue, isUpdate, options = {}, clb = () => {}) {
    if (this.services?.utils?.hasLoadedNamespace && !this.services?.utils?.hasLoadedNamespace(namespace)) {
      this.logger.warn(`did not save key "${key}" as the namespace "${namespace}" was not yet loaded`, 'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!');
      return;
    }
    if (key === undefined || key === null || key === '') return;
    if (this.backend?.create) {
      const opts = {
        ...options,
        isUpdate
      };
      const fc = this.backend.create.bind(this.backend);
      if (fc.length < 6) {
        try {
          let r;
          if (fc.length === 5) {
            r = fc(languages, namespace, key, fallbackValue, opts);
          } else {
            r = fc(languages, namespace, key, fallbackValue);
          }
          if (r && typeof r.then === 'function') {
            r.then(data => clb(null, data)).catch(clb);
          } else {
            clb(null, r);
          }
        } catch (err) {
          clb(err);
        }
      } else {
        fc(languages, namespace, key, fallbackValue, clb, opts);
      }
    }
    if (!languages || !languages[0]) return;
    this.store.addResource(languages[0], namespace, key, fallbackValue);
  }
}

const get = () => ({
  debug: false,
  initAsync: true,
  ns: ['translation'],
  defaultNS: ['translation'],
  fallbackLng: ['dev'],
  fallbackNS: false,
  supportedLngs: false,
  nonExplicitSupportedLngs: false,
  load: 'all',
  preload: false,
  simplifyPluralSuffix: true,
  keySeparator: '.',
  nsSeparator: ':',
  pluralSeparator: '_',
  contextSeparator: '_',
  partialBundledLanguages: false,
  saveMissing: false,
  updateMissing: false,
  saveMissingTo: 'fallback',
  saveMissingPlurals: true,
  missingKeyHandler: false,
  missingInterpolationHandler: false,
  postProcess: false,
  postProcessPassResolved: false,
  returnNull: false,
  returnEmptyString: true,
  returnObjects: false,
  joinArrays: false,
  returnedObjectHandler: false,
  parseMissingKeyHandler: false,
  appendNamespaceToMissingKey: false,
  appendNamespaceToCIMode: false,
  overloadTranslationOptionHandler: args => {
    let ret = {};
    if (typeof args[1] === 'object') ret = args[1];
    if (isString(args[1])) ret.defaultValue = args[1];
    if (isString(args[2])) ret.tDescription = args[2];
    if (typeof args[2] === 'object' || typeof args[3] === 'object') {
      const options = args[3] || args[2];
      Object.keys(options).forEach(key => {
        ret[key] = options[key];
      });
    }
    return ret;
  },
  interpolation: {
    escapeValue: true,
    format: value => value,
    prefix: '{{',
    suffix: '}}',
    formatSeparator: ',',
    unescapePrefix: '-',
    nestingPrefix: '$t(',
    nestingSuffix: ')',
    nestingOptionsSeparator: ',',
    maxReplaces: 1000,
    skipOnVariables: true
  },
  cacheInBuiltFormats: true
});
const transformOptions = options => {
  if (isString(options.ns)) options.ns = [options.ns];
  if (isString(options.fallbackLng)) options.fallbackLng = [options.fallbackLng];
  if (isString(options.fallbackNS)) options.fallbackNS = [options.fallbackNS];
  if (options.supportedLngs?.indexOf?.('cimode') < 0) {
    options.supportedLngs = options.supportedLngs.concat(['cimode']);
  }
  if (typeof options.initImmediate === 'boolean') options.initAsync = options.initImmediate;
  return options;
};

const noop = () => {};
const bindMemberFunctions = inst => {
  const mems = Object.getOwnPropertyNames(Object.getPrototypeOf(inst));
  mems.forEach(mem => {
    if (typeof inst[mem] === 'function') {
      inst[mem] = inst[mem].bind(inst);
    }
  });
};
class I18n extends EventEmitter {
  constructor(options = {}, callback) {
    super();
    this.options = transformOptions(options);
    this.services = {};
    this.logger = baseLogger;
    this.modules = {
      external: []
    };
    bindMemberFunctions(this);
    if (callback && !this.isInitialized && !options.isClone) {
      if (!this.options.initAsync) {
        this.init(options, callback);
        return this;
      }
      setTimeout(() => {
        this.init(options, callback);
      }, 0);
    }
  }
  init(options = {}, callback) {
    this.isInitializing = true;
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    if (options.defaultNS == null && options.ns) {
      if (isString(options.ns)) {
        options.defaultNS = options.ns;
      } else if (options.ns.indexOf('translation') < 0) {
        options.defaultNS = options.ns[0];
      }
    }
    const defOpts = get();
    this.options = {
      ...defOpts,
      ...this.options,
      ...transformOptions(options)
    };
    this.options.interpolation = {
      ...defOpts.interpolation,
      ...this.options.interpolation
    };
    if (options.keySeparator !== undefined) {
      this.options.userDefinedKeySeparator = options.keySeparator;
    }
    if (options.nsSeparator !== undefined) {
      this.options.userDefinedNsSeparator = options.nsSeparator;
    }
    const createClassOnDemand = ClassOrObject => {
      if (!ClassOrObject) return null;
      if (typeof ClassOrObject === 'function') return new ClassOrObject();
      return ClassOrObject;
    };
    if (!this.options.isClone) {
      if (this.modules.logger) {
        baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
      } else {
        baseLogger.init(null, this.options);
      }
      let formatter;
      if (this.modules.formatter) {
        formatter = this.modules.formatter;
      } else {
        formatter = Formatter;
      }
      const lu = new LanguageUtil(this.options);
      this.store = new ResourceStore(this.options.resources, this.options);
      const s = this.services;
      s.logger = baseLogger;
      s.resourceStore = this.store;
      s.languageUtils = lu;
      s.pluralResolver = new PluralResolver(lu, {
        prepend: this.options.pluralSeparator,
        simplifyPluralSuffix: this.options.simplifyPluralSuffix
      });
      const usingLegacyFormatFunction = this.options.interpolation.format && this.options.interpolation.format !== defOpts.interpolation.format;
      if (usingLegacyFormatFunction) {
        this.logger.warn(`init: you are still using the legacy format function, please use the new approach: https://www.i18next.com/translation-function/formatting`);
      }
      if (formatter && (!this.options.interpolation.format || this.options.interpolation.format === defOpts.interpolation.format)) {
        s.formatter = createClassOnDemand(formatter);
        if (s.formatter.init) s.formatter.init(s, this.options);
        this.options.interpolation.format = s.formatter.format.bind(s.formatter);
      }
      s.interpolator = new Interpolator(this.options);
      s.utils = {
        hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
      };
      s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
      s.backendConnector.on('*', (event, ...args) => {
        this.emit(event, ...args);
      });
      if (this.modules.languageDetector) {
        s.languageDetector = createClassOnDemand(this.modules.languageDetector);
        if (s.languageDetector.init) s.languageDetector.init(s, this.options.detection, this.options);
      }
      if (this.modules.i18nFormat) {
        s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
        if (s.i18nFormat.init) s.i18nFormat.init(this);
      }
      this.translator = new Translator(this.services, this.options);
      this.translator.on('*', (event, ...args) => {
        this.emit(event, ...args);
      });
      this.modules.external.forEach(m => {
        if (m.init) m.init(this);
      });
    }
    this.format = this.options.interpolation.format;
    if (!callback) callback = noop;
    if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
      const codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
      if (codes.length > 0 && codes[0] !== 'dev') this.options.lng = codes[0];
    }
    if (!this.services.languageDetector && !this.options.lng) {
      this.logger.warn('init: no languageDetector is used and no lng is defined');
    }
    const storeApi = ['getResource', 'hasResourceBundle', 'getResourceBundle', 'getDataByLanguage'];
    storeApi.forEach(fcName => {
      this[fcName] = (...args) => this.store[fcName](...args);
    });
    const storeApiChained = ['addResource', 'addResources', 'addResourceBundle', 'removeResourceBundle'];
    storeApiChained.forEach(fcName => {
      this[fcName] = (...args) => {
        this.store[fcName](...args);
        return this;
      };
    });
    const deferred = defer();
    const load = () => {
      const finish = (err, t) => {
        this.isInitializing = false;
        if (this.isInitialized && !this.initializedStoreOnce) this.logger.warn('init: i18next is already initialized. You should call init just once!');
        this.isInitialized = true;
        if (!this.options.isClone) this.logger.log('initialized', this.options);
        this.emit('initialized', this.options);
        deferred.resolve(t);
        callback(err, t);
      };
      if (this.languages && !this.isInitialized) return finish(null, this.t.bind(this));
      this.changeLanguage(this.options.lng, finish);
    };
    if (this.options.resources || !this.options.initAsync) {
      load();
    } else {
      setTimeout(load, 0);
    }
    return deferred;
  }
  loadResources(language, callback = noop) {
    let usedCallback = callback;
    const usedLng = isString(language) ? language : this.language;
    if (typeof language === 'function') usedCallback = language;
    if (!this.options.resources || this.options.partialBundledLanguages) {
      if (usedLng?.toLowerCase() === 'cimode' && (!this.options.preload || this.options.preload.length === 0)) return usedCallback();
      const toLoad = [];
      const append = lng => {
        if (!lng) return;
        if (lng === 'cimode') return;
        const lngs = this.services.languageUtils.toResolveHierarchy(lng);
        lngs.forEach(l => {
          if (l === 'cimode') return;
          if (toLoad.indexOf(l) < 0) toLoad.push(l);
        });
      };
      if (!usedLng) {
        const fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
        fallbacks.forEach(l => append(l));
      } else {
        append(usedLng);
      }
      this.options.preload?.forEach?.(l => append(l));
      this.services.backendConnector.load(toLoad, this.options.ns, e => {
        if (!e && !this.resolvedLanguage && this.language) this.setResolvedLanguage(this.language);
        usedCallback(e);
      });
    } else {
      usedCallback(null);
    }
  }
  reloadResources(lngs, ns, callback) {
    const deferred = defer();
    if (typeof lngs === 'function') {
      callback = lngs;
      lngs = undefined;
    }
    if (typeof ns === 'function') {
      callback = ns;
      ns = undefined;
    }
    if (!lngs) lngs = this.languages;
    if (!ns) ns = this.options.ns;
    if (!callback) callback = noop;
    this.services.backendConnector.reload(lngs, ns, err => {
      deferred.resolve();
      callback(err);
    });
    return deferred;
  }
  use(module) {
    if (!module) throw new Error('You are passing an undefined module! Please check the object you are passing to i18next.use()');
    if (!module.type) throw new Error('You are passing a wrong module! Please check the object you are passing to i18next.use()');
    if (module.type === 'backend') {
      this.modules.backend = module;
    }
    if (module.type === 'logger' || module.log && module.warn && module.error) {
      this.modules.logger = module;
    }
    if (module.type === 'languageDetector') {
      this.modules.languageDetector = module;
    }
    if (module.type === 'i18nFormat') {
      this.modules.i18nFormat = module;
    }
    if (module.type === 'postProcessor') {
      postProcessor.addPostProcessor(module);
    }
    if (module.type === 'formatter') {
      this.modules.formatter = module;
    }
    if (module.type === '3rdParty') {
      this.modules.external.push(module);
    }
    return this;
  }
  setResolvedLanguage(l) {
    if (!l || !this.languages) return;
    if (['cimode', 'dev'].indexOf(l) > -1) return;
    for (let li = 0; li < this.languages.length; li++) {
      const lngInLngs = this.languages[li];
      if (['cimode', 'dev'].indexOf(lngInLngs) > -1) continue;
      if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
        this.resolvedLanguage = lngInLngs;
        break;
      }
    }
    if (!this.resolvedLanguage && this.languages.indexOf(l) < 0 && this.store.hasLanguageSomeTranslations(l)) {
      this.resolvedLanguage = l;
      this.languages.unshift(l);
    }
  }
  changeLanguage(lng, callback) {
    this.isLanguageChangingTo = lng;
    const deferred = defer();
    this.emit('languageChanging', lng);
    const setLngProps = l => {
      this.language = l;
      this.languages = this.services.languageUtils.toResolveHierarchy(l);
      this.resolvedLanguage = undefined;
      this.setResolvedLanguage(l);
    };
    const done = (err, l) => {
      if (l) {
        if (this.isLanguageChangingTo === lng) {
          setLngProps(l);
          this.translator.changeLanguage(l);
          this.isLanguageChangingTo = undefined;
          this.emit('languageChanged', l);
          this.logger.log('languageChanged', l);
        }
      } else {
        this.isLanguageChangingTo = undefined;
      }
      deferred.resolve((...args) => this.t(...args));
      if (callback) callback(err, (...args) => this.t(...args));
    };
    const setLng = lngs => {
      if (!lng && !lngs && this.services.languageDetector) lngs = [];
      const fl = isString(lngs) ? lngs : lngs && lngs[0];
      const l = this.store.hasLanguageSomeTranslations(fl) ? fl : this.services.languageUtils.getBestMatchFromCodes(isString(lngs) ? [lngs] : lngs);
      if (l) {
        if (!this.language) {
          setLngProps(l);
        }
        if (!this.translator.language) this.translator.changeLanguage(l);
        this.services.languageDetector?.cacheUserLanguage?.(l);
      }
      this.loadResources(l, err => {
        done(err, l);
      });
    };
    if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
      setLng(this.services.languageDetector.detect());
    } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
      if (this.services.languageDetector.detect.length === 0) {
        this.services.languageDetector.detect().then(setLng);
      } else {
        this.services.languageDetector.detect(setLng);
      }
    } else {
      setLng(lng);
    }
    return deferred;
  }
  getFixedT(lng, ns, keyPrefix) {
    const fixedT = (key, opts, ...rest) => {
      let o;
      if (typeof opts !== 'object') {
        o = this.options.overloadTranslationOptionHandler([key, opts].concat(rest));
      } else {
        o = {
          ...opts
        };
      }
      o.lng = o.lng || fixedT.lng;
      o.lngs = o.lngs || fixedT.lngs;
      o.ns = o.ns || fixedT.ns;
      if (o.keyPrefix !== '') o.keyPrefix = o.keyPrefix || keyPrefix || fixedT.keyPrefix;
      const keySeparator = this.options.keySeparator || '.';
      let resultKey;
      if (o.keyPrefix && Array.isArray(key)) {
        resultKey = key.map(k => `${o.keyPrefix}${keySeparator}${k}`);
      } else {
        resultKey = o.keyPrefix ? `${o.keyPrefix}${keySeparator}${key}` : key;
      }
      return this.t(resultKey, o);
    };
    if (isString(lng)) {
      fixedT.lng = lng;
    } else {
      fixedT.lngs = lng;
    }
    fixedT.ns = ns;
    fixedT.keyPrefix = keyPrefix;
    return fixedT;
  }
  t(...args) {
    return this.translator?.translate(...args);
  }
  exists(...args) {
    return this.translator?.exists(...args);
  }
  setDefaultNamespace(ns) {
    this.options.defaultNS = ns;
  }
  hasLoadedNamespace(ns, options = {}) {
    if (!this.isInitialized) {
      this.logger.warn('hasLoadedNamespace: i18next was not initialized', this.languages);
      return false;
    }
    if (!this.languages || !this.languages.length) {
      this.logger.warn('hasLoadedNamespace: i18n.languages were undefined or empty', this.languages);
      return false;
    }
    const lng = options.lng || this.resolvedLanguage || this.languages[0];
    const fallbackLng = this.options ? this.options.fallbackLng : false;
    const lastLng = this.languages[this.languages.length - 1];
    if (lng.toLowerCase() === 'cimode') return true;
    const loadNotPending = (l, n) => {
      const loadState = this.services.backendConnector.state[`${l}|${n}`];
      return loadState === -1 || loadState === 0 || loadState === 2;
    };
    if (options.precheck) {
      const preResult = options.precheck(this, loadNotPending);
      if (preResult !== undefined) return preResult;
    }
    if (this.hasResourceBundle(lng, ns)) return true;
    if (!this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages) return true;
    if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
    return false;
  }
  loadNamespaces(ns, callback) {
    const deferred = defer();
    if (!this.options.ns) {
      if (callback) callback();
      return Promise.resolve();
    }
    if (isString(ns)) ns = [ns];
    ns.forEach(n => {
      if (this.options.ns.indexOf(n) < 0) this.options.ns.push(n);
    });
    this.loadResources(err => {
      deferred.resolve();
      if (callback) callback(err);
    });
    return deferred;
  }
  loadLanguages(lngs, callback) {
    const deferred = defer();
    if (isString(lngs)) lngs = [lngs];
    const preloaded = this.options.preload || [];
    const newLngs = lngs.filter(lng => preloaded.indexOf(lng) < 0 && this.services.languageUtils.isSupportedCode(lng));
    if (!newLngs.length) {
      if (callback) callback();
      return Promise.resolve();
    }
    this.options.preload = preloaded.concat(newLngs);
    this.loadResources(err => {
      deferred.resolve();
      if (callback) callback(err);
    });
    return deferred;
  }
  dir(lng) {
    if (!lng) lng = this.resolvedLanguage || (this.languages?.length > 0 ? this.languages[0] : this.language);
    if (!lng) return 'rtl';
    try {
      const l = new Intl.Locale(lng);
      if (l && l.getTextInfo) {
        const ti = l.getTextInfo();
        if (ti && ti.direction) return ti.direction;
      }
    } catch (e) {}
    const rtlLngs = ['ar', 'shu', 'sqr', 'ssh', 'xaa', 'yhd', 'yud', 'aao', 'abh', 'abv', 'acm', 'acq', 'acw', 'acx', 'acy', 'adf', 'ads', 'aeb', 'aec', 'afb', 'ajp', 'apc', 'apd', 'arb', 'arq', 'ars', 'ary', 'arz', 'auz', 'avl', 'ayh', 'ayl', 'ayn', 'ayp', 'bbz', 'pga', 'he', 'iw', 'ps', 'pbt', 'pbu', 'pst', 'prp', 'prd', 'ug', 'ur', 'ydd', 'yds', 'yih', 'ji', 'yi', 'hbo', 'men', 'xmn', 'fa', 'jpr', 'peo', 'pes', 'prs', 'dv', 'sam', 'ckb'];
    const languageUtils = this.services?.languageUtils || new LanguageUtil(get());
    if (lng.toLowerCase().indexOf('-latn') > 1) return 'ltr';
    return rtlLngs.indexOf(languageUtils.getLanguagePartFromCode(lng)) > -1 || lng.toLowerCase().indexOf('-arab') > 1 ? 'rtl' : 'ltr';
  }
  static createInstance(options = {}, callback) {
    return new I18n(options, callback);
  }
  cloneInstance(options = {}, callback = noop) {
    const forkResourceStore = options.forkResourceStore;
    if (forkResourceStore) delete options.forkResourceStore;
    const mergedOptions = {
      ...this.options,
      ...options,
      ...{
        isClone: true
      }
    };
    const clone = new I18n(mergedOptions);
    if (options.debug !== undefined || options.prefix !== undefined) {
      clone.logger = clone.logger.clone(options);
    }
    const membersToCopy = ['store', 'services', 'language'];
    membersToCopy.forEach(m => {
      clone[m] = this[m];
    });
    clone.services = {
      ...this.services
    };
    clone.services.utils = {
      hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
    };
    if (forkResourceStore) {
      const clonedData = Object.keys(this.store.data).reduce((prev, l) => {
        prev[l] = {
          ...this.store.data[l]
        };
        prev[l] = Object.keys(prev[l]).reduce((acc, n) => {
          acc[n] = {
            ...prev[l][n]
          };
          return acc;
        }, prev[l]);
        return prev;
      }, {});
      clone.store = new ResourceStore(clonedData, mergedOptions);
      clone.services.resourceStore = clone.store;
    }
    clone.translator = new Translator(clone.services, mergedOptions);
    clone.translator.on('*', (event, ...args) => {
      clone.emit(event, ...args);
    });
    clone.init(mergedOptions, callback);
    clone.translator.options = mergedOptions;
    clone.translator.backendConnector.services.utils = {
      hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
    };
    return clone;
  }
  toJSON() {
    return {
      options: this.options,
      store: this.store,
      language: this.language,
      languages: this.languages,
      resolvedLanguage: this.resolvedLanguage
    };
  }
}
const instance = I18n.createInstance();
instance.createInstance = I18n.createInstance;

const createInstance = instance.createInstance;
const dir = instance.dir;
const init = instance.init;
const loadResources = instance.loadResources;
const reloadResources = instance.reloadResources;
const use = instance.use;
const changeLanguage = instance.changeLanguage;
const getFixedT = instance.getFixedT;
const t = instance.t;
const exists = instance.exists;
const setDefaultNamespace = instance.setDefaultNamespace;
const hasLoadedNamespace = instance.hasLoadedNamespace;
const loadNamespaces = instance.loadNamespaces;
const loadLanguages = instance.loadLanguages;




/***/ }),

/***/ 2708:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Trash2)
/* harmony export */ });
/* unused harmony export __iconNode */
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9407);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("trash-2", __iconNode);


//# sourceMappingURL=trash-2.js.map


/***/ }),

/***/ 2762:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1354);
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6314);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4417);
/* harmony import */ var _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(1645), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(3621), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_2___ = new URL(/* asset import */ __webpack_require__(5031), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_3___ = new URL(/* asset import */ __webpack_require__(9844), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_4___ = new URL(/* asset import */ __webpack_require__(7490), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_5___ = new URL(/* asset import */ __webpack_require__(7536), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_6___ = new URL(/* asset import */ __webpack_require__(5824), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_7___ = new URL(/* asset import */ __webpack_require__(1158), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_8___ = new URL(/* asset import */ __webpack_require__(9549), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_9___ = new URL(/* asset import */ __webpack_require__(3989), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_10___ = new URL(/* asset import */ __webpack_require__(3204), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_11___ = new URL(/* asset import */ __webpack_require__(3938), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_12___ = new URL(/* asset import */ __webpack_require__(8090), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_13___ = new URL(/* asset import */ __webpack_require__(5016), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_2___);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_3___);
var ___CSS_LOADER_URL_REPLACEMENT_4___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_4___);
var ___CSS_LOADER_URL_REPLACEMENT_5___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_5___);
var ___CSS_LOADER_URL_REPLACEMENT_6___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_6___);
var ___CSS_LOADER_URL_REPLACEMENT_7___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_7___);
var ___CSS_LOADER_URL_REPLACEMENT_8___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_8___);
var ___CSS_LOADER_URL_REPLACEMENT_9___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_9___);
var ___CSS_LOADER_URL_REPLACEMENT_10___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_10___);
var ___CSS_LOADER_URL_REPLACEMENT_11___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_11___);
var ___CSS_LOADER_URL_REPLACEMENT_12___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_12___);
var ___CSS_LOADER_URL_REPLACEMENT_13___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_13___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* inter-cyrillic-ext-400-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_0___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_1___}) format('woff');
  unicode-range: U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F;
}

/* inter-cyrillic-400-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_2___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_3___}) format('woff');
  unicode-range: U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116;
}

/* inter-greek-ext-400-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_4___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_5___}) format('woff');
  unicode-range: U+1F00-1FFF;
}

/* inter-greek-400-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_6___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_7___}) format('woff');
  unicode-range: U+0370-0377,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03FF;
}

/* inter-vietnamese-400-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_8___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_9___}) format('woff');
  unicode-range: U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB;
}

/* inter-latin-ext-400-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_10___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_11___}) format('woff');
  unicode-range: U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;
}

/* inter-latin-400-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_12___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_13___}) format('woff');
  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
}`, "",{"version":3,"sources":["webpack://./node_modules/@fontsource/inter/400.css"],"names":[],"mappings":"AAAA,kCAAkC;AAClC;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,oHAAqI;EACrI,iFAAiF;AACnF;;AAEA,8BAA8B;AAC9B;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,oHAA6H;EAC7H,gEAAgE;AAClE;;AAEA,+BAA+B;AAC/B;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,oHAA+H;EAC/H,0BAA0B;AAC5B;;AAEA,2BAA2B;AAC3B;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,oHAAuH;EACvH,iFAAiF;AACnF;;AAEA,gCAAgC;AAChC;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,oHAAiI;EACjI,2JAA2J;AAC7J;;AAEA,+BAA+B;AAC/B;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,sHAA+H;EAC/H,iMAAiM;AACnM;;AAEA,2BAA2B;AAC3B;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,sHAAuH;EACvH,uKAAuK;AACzK","sourcesContent":["/* inter-cyrillic-ext-400-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 400;\n  src: url(./files/inter-cyrillic-ext-400-normal.woff2) format('woff2'), url(./files/inter-cyrillic-ext-400-normal.woff) format('woff');\n  unicode-range: U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F;\n}\n\n/* inter-cyrillic-400-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 400;\n  src: url(./files/inter-cyrillic-400-normal.woff2) format('woff2'), url(./files/inter-cyrillic-400-normal.woff) format('woff');\n  unicode-range: U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116;\n}\n\n/* inter-greek-ext-400-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 400;\n  src: url(./files/inter-greek-ext-400-normal.woff2) format('woff2'), url(./files/inter-greek-ext-400-normal.woff) format('woff');\n  unicode-range: U+1F00-1FFF;\n}\n\n/* inter-greek-400-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 400;\n  src: url(./files/inter-greek-400-normal.woff2) format('woff2'), url(./files/inter-greek-400-normal.woff) format('woff');\n  unicode-range: U+0370-0377,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03FF;\n}\n\n/* inter-vietnamese-400-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 400;\n  src: url(./files/inter-vietnamese-400-normal.woff2) format('woff2'), url(./files/inter-vietnamese-400-normal.woff) format('woff');\n  unicode-range: U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB;\n}\n\n/* inter-latin-ext-400-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 400;\n  src: url(./files/inter-latin-ext-400-normal.woff2) format('woff2'), url(./files/inter-latin-ext-400-normal.woff) format('woff');\n  unicode-range: U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;\n}\n\n/* inter-latin-400-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 400;\n  src: url(./files/inter-latin-400-normal.woff2) format('woff2'), url(./files/inter-latin-400-normal.woff) format('woff');\n  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 2888:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5072);
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7825);
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7659);
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5056);
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(540);
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1113);
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_700_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1137);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_700_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A, options);




       /* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_700_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A && _css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_700_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A.locals ? _css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_700_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A.locals : undefined);


/***/ }),

/***/ 2962:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "8148c3ae14dfaefc62ca.woff2";

/***/ }),

/***/ 3124:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "83c86cfda9c5fd96a471.woff";

/***/ }),

/***/ 3193:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "f5fbdfc39c2431160896.woff2";

/***/ }),

/***/ 3204:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "210fb826cb25acbd4094.woff2";

/***/ }),

/***/ 3580:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1354);
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6314);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4417);
/* harmony import */ var _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(895), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(4255), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_2___ = new URL(/* asset import */ __webpack_require__(7733), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_3___ = new URL(/* asset import */ __webpack_require__(7053), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_4___ = new URL(/* asset import */ __webpack_require__(4084), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_5___ = new URL(/* asset import */ __webpack_require__(5762), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_6___ = new URL(/* asset import */ __webpack_require__(3918), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_7___ = new URL(/* asset import */ __webpack_require__(3124), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_8___ = new URL(/* asset import */ __webpack_require__(9839), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_9___ = new URL(/* asset import */ __webpack_require__(6415), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_10___ = new URL(/* asset import */ __webpack_require__(2962), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_11___ = new URL(/* asset import */ __webpack_require__(5712), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_12___ = new URL(/* asset import */ __webpack_require__(4668), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_13___ = new URL(/* asset import */ __webpack_require__(7066), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_2___);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_3___);
var ___CSS_LOADER_URL_REPLACEMENT_4___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_4___);
var ___CSS_LOADER_URL_REPLACEMENT_5___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_5___);
var ___CSS_LOADER_URL_REPLACEMENT_6___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_6___);
var ___CSS_LOADER_URL_REPLACEMENT_7___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_7___);
var ___CSS_LOADER_URL_REPLACEMENT_8___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_8___);
var ___CSS_LOADER_URL_REPLACEMENT_9___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_9___);
var ___CSS_LOADER_URL_REPLACEMENT_10___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_10___);
var ___CSS_LOADER_URL_REPLACEMENT_11___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_11___);
var ___CSS_LOADER_URL_REPLACEMENT_12___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_12___);
var ___CSS_LOADER_URL_REPLACEMENT_13___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_13___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* inter-cyrillic-ext-600-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 600;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_0___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_1___}) format('woff');
  unicode-range: U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F;
}

/* inter-cyrillic-600-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 600;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_2___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_3___}) format('woff');
  unicode-range: U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116;
}

/* inter-greek-ext-600-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 600;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_4___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_5___}) format('woff');
  unicode-range: U+1F00-1FFF;
}

/* inter-greek-600-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 600;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_6___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_7___}) format('woff');
  unicode-range: U+0370-0377,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03FF;
}

/* inter-vietnamese-600-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 600;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_8___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_9___}) format('woff');
  unicode-range: U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB;
}

/* inter-latin-ext-600-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 600;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_10___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_11___}) format('woff');
  unicode-range: U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;
}

/* inter-latin-600-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 600;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_12___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_13___}) format('woff');
  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
}`, "",{"version":3,"sources":["webpack://./node_modules/@fontsource/inter/600.css"],"names":[],"mappings":"AAAA,kCAAkC;AAClC;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,oHAAqI;EACrI,iFAAiF;AACnF;;AAEA,8BAA8B;AAC9B;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,oHAA6H;EAC7H,gEAAgE;AAClE;;AAEA,+BAA+B;AAC/B;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,oHAA+H;EAC/H,0BAA0B;AAC5B;;AAEA,2BAA2B;AAC3B;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,oHAAuH;EACvH,iFAAiF;AACnF;;AAEA,gCAAgC;AAChC;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,oHAAiI;EACjI,2JAA2J;AAC7J;;AAEA,+BAA+B;AAC/B;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,sHAA+H;EAC/H,iMAAiM;AACnM;;AAEA,2BAA2B;AAC3B;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,sHAAuH;EACvH,uKAAuK;AACzK","sourcesContent":["/* inter-cyrillic-ext-600-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 600;\n  src: url(./files/inter-cyrillic-ext-600-normal.woff2) format('woff2'), url(./files/inter-cyrillic-ext-600-normal.woff) format('woff');\n  unicode-range: U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F;\n}\n\n/* inter-cyrillic-600-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 600;\n  src: url(./files/inter-cyrillic-600-normal.woff2) format('woff2'), url(./files/inter-cyrillic-600-normal.woff) format('woff');\n  unicode-range: U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116;\n}\n\n/* inter-greek-ext-600-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 600;\n  src: url(./files/inter-greek-ext-600-normal.woff2) format('woff2'), url(./files/inter-greek-ext-600-normal.woff) format('woff');\n  unicode-range: U+1F00-1FFF;\n}\n\n/* inter-greek-600-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 600;\n  src: url(./files/inter-greek-600-normal.woff2) format('woff2'), url(./files/inter-greek-600-normal.woff) format('woff');\n  unicode-range: U+0370-0377,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03FF;\n}\n\n/* inter-vietnamese-600-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 600;\n  src: url(./files/inter-vietnamese-600-normal.woff2) format('woff2'), url(./files/inter-vietnamese-600-normal.woff) format('woff');\n  unicode-range: U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB;\n}\n\n/* inter-latin-ext-600-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 600;\n  src: url(./files/inter-latin-ext-600-normal.woff2) format('woff2'), url(./files/inter-latin-ext-600-normal.woff) format('woff');\n  unicode-range: U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;\n}\n\n/* inter-latin-600-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 600;\n  src: url(./files/inter-latin-600-normal.woff2) format('woff2'), url(./files/inter-latin-600-normal.woff) format('woff');\n  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 3621:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "c676f175d430bd465724.woff";

/***/ }),

/***/ 3918:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "5c46a357ea91911fc65d.woff2";

/***/ }),

/***/ 3938:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "c616205185f0d3677df9.woff";

/***/ }),

/***/ 3954:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Mail)
/* harmony export */ });
/* unused harmony export __iconNode */
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9407);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("mail", __iconNode);


//# sourceMappingURL=mail.js.map


/***/ }),

/***/ 3989:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "aaa15d735e3826061950.woff";

/***/ }),

/***/ 4084:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "c8a7cddec49294a9e8ba.woff2";

/***/ }),

/***/ 4175:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "ca8751b8c028cb9ae710.woff";

/***/ }),

/***/ 4255:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "2c47e01b64f03ba9fb58.woff";

/***/ }),

/***/ 4417:
/***/ ((module) => {

"use strict";


module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ 4668:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "69a8d1d484967aba2389.woff2";

/***/ }),

/***/ 4677:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "045dde1e05b73ab35d25.woff";

/***/ }),

/***/ 4722:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "0ddea3beace60380deb1.woff";

/***/ }),

/***/ 4915:
/***/ ((module) => {

/**
 * This file automatically generated from `pre-publish.js`.
 * Do not manually edit.
 */

module.exports = {
  "area": true,
  "base": true,
  "br": true,
  "col": true,
  "embed": true,
  "hr": true,
  "img": true,
  "input": true,
  "link": true,
  "meta": true,
  "param": true,
  "source": true,
  "track": true,
  "wbr": true
};


/***/ }),

/***/ 4997:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Browser)
/* harmony export */ });
const {
  slice,
  forEach
} = [];
function defaults(obj) {
  forEach.call(slice.call(arguments, 1), source => {
    if (source) {
      for (const prop in source) {
        if (obj[prop] === undefined) obj[prop] = source[prop];
      }
    }
  });
  return obj;
}
function hasXSS(input) {
  if (typeof input !== 'string') return false;

  // Common XSS attack patterns
  const xssPatterns = [/<\s*script.*?>/i, /<\s*\/\s*script\s*>/i, /<\s*img.*?on\w+\s*=/i, /<\s*\w+\s*on\w+\s*=.*?>/i, /javascript\s*:/i, /vbscript\s*:/i, /expression\s*\(/i, /eval\s*\(/i, /alert\s*\(/i, /document\.cookie/i, /document\.write\s*\(/i, /window\.location/i, /innerHTML/i];
  return xssPatterns.some(pattern => pattern.test(input));
}

// eslint-disable-next-line no-control-regex
const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
const serializeCookie = function (name, val) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    path: '/'
  };
  const opt = options;
  const value = encodeURIComponent(val);
  let str = `${name}=${value}`;
  if (opt.maxAge > 0) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge)) throw new Error('maxAge should be a Number');
    str += `; Max-Age=${Math.floor(maxAge)}`;
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }
    str += `; Domain=${opt.domain}`;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }
    str += `; Path=${opt.path}`;
  }
  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== 'function') {
      throw new TypeError('option expires is invalid');
    }
    str += `; Expires=${opt.expires.toUTCString()}`;
  }
  if (opt.httpOnly) str += '; HttpOnly';
  if (opt.secure) str += '; Secure';
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === 'string' ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true:
        str += '; SameSite=Strict';
        break;
      case 'lax':
        str += '; SameSite=Lax';
        break;
      case 'strict':
        str += '; SameSite=Strict';
        break;
      case 'none':
        str += '; SameSite=None';
        break;
      default:
        throw new TypeError('option sameSite is invalid');
    }
  }
  if (opt.partitioned) str += '; Partitioned';
  return str;
};
const cookie = {
  create(name, value, minutes, domain) {
    let cookieOptions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
      path: '/',
      sameSite: 'strict'
    };
    if (minutes) {
      cookieOptions.expires = new Date();
      cookieOptions.expires.setTime(cookieOptions.expires.getTime() + minutes * 60 * 1000);
    }
    if (domain) cookieOptions.domain = domain;
    document.cookie = serializeCookie(name, value, cookieOptions);
  },
  read(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },
  remove(name, domain) {
    this.create(name, '', -1, domain);
  }
};
var cookie$1 = {
  name: 'cookie',
  // Deconstruct the options object and extract the lookupCookie property
  lookup(_ref) {
    let {
      lookupCookie
    } = _ref;
    if (lookupCookie && typeof document !== 'undefined') {
      return cookie.read(lookupCookie) || undefined;
    }
    return undefined;
  },
  // Deconstruct the options object and extract the lookupCookie, cookieMinutes, cookieDomain, and cookieOptions properties
  cacheUserLanguage(lng, _ref2) {
    let {
      lookupCookie,
      cookieMinutes,
      cookieDomain,
      cookieOptions
    } = _ref2;
    if (lookupCookie && typeof document !== 'undefined') {
      cookie.create(lookupCookie, lng, cookieMinutes, cookieDomain, cookieOptions);
    }
  }
};

var querystring = {
  name: 'querystring',
  // Deconstruct the options object and extract the lookupQuerystring property
  lookup(_ref) {
    let {
      lookupQuerystring
    } = _ref;
    let found;
    if (typeof window !== 'undefined') {
      let {
        search
      } = window.location;
      if (!window.location.search && window.location.hash?.indexOf('?') > -1) {
        search = window.location.hash.substring(window.location.hash.indexOf('?'));
      }
      const query = search.substring(1);
      const params = query.split('&');
      for (let i = 0; i < params.length; i++) {
        const pos = params[i].indexOf('=');
        if (pos > 0) {
          const key = params[i].substring(0, pos);
          if (key === lookupQuerystring) {
            found = params[i].substring(pos + 1);
          }
        }
      }
    }
    return found;
  }
};

var hash = {
  name: 'hash',
  // Deconstruct the options object and extract the lookupHash property and the lookupFromHashIndex property
  lookup(_ref) {
    let {
      lookupHash,
      lookupFromHashIndex
    } = _ref;
    let found;
    if (typeof window !== 'undefined') {
      const {
        hash
      } = window.location;
      if (hash && hash.length > 2) {
        const query = hash.substring(1);
        if (lookupHash) {
          const params = query.split('&');
          for (let i = 0; i < params.length; i++) {
            const pos = params[i].indexOf('=');
            if (pos > 0) {
              const key = params[i].substring(0, pos);
              if (key === lookupHash) {
                found = params[i].substring(pos + 1);
              }
            }
          }
        }
        if (found) return found;
        if (!found && lookupFromHashIndex > -1) {
          const language = hash.match(/\/([a-zA-Z-]*)/g);
          if (!Array.isArray(language)) return undefined;
          const index = typeof lookupFromHashIndex === 'number' ? lookupFromHashIndex : 0;
          return language[index]?.replace('/', '');
        }
      }
    }
    return found;
  }
};

let hasLocalStorageSupport = null;
const localStorageAvailable = () => {
  if (hasLocalStorageSupport !== null) return hasLocalStorageSupport;
  try {
    hasLocalStorageSupport = typeof window !== 'undefined' && window.localStorage !== null;
    if (!hasLocalStorageSupport) {
      return false;
    }
    const testKey = 'i18next.translate.boo';
    window.localStorage.setItem(testKey, 'foo');
    window.localStorage.removeItem(testKey);
  } catch (e) {
    hasLocalStorageSupport = false;
  }
  return hasLocalStorageSupport;
};
var localStorage = {
  name: 'localStorage',
  // Deconstruct the options object and extract the lookupLocalStorage property
  lookup(_ref) {
    let {
      lookupLocalStorage
    } = _ref;
    if (lookupLocalStorage && localStorageAvailable()) {
      return window.localStorage.getItem(lookupLocalStorage) || undefined; // Undefined ensures type consistency with the previous version of this function
    }
    return undefined;
  },
  // Deconstruct the options object and extract the lookupLocalStorage property
  cacheUserLanguage(lng, _ref2) {
    let {
      lookupLocalStorage
    } = _ref2;
    if (lookupLocalStorage && localStorageAvailable()) {
      window.localStorage.setItem(lookupLocalStorage, lng);
    }
  }
};

let hasSessionStorageSupport = null;
const sessionStorageAvailable = () => {
  if (hasSessionStorageSupport !== null) return hasSessionStorageSupport;
  try {
    hasSessionStorageSupport = typeof window !== 'undefined' && window.sessionStorage !== null;
    if (!hasSessionStorageSupport) {
      return false;
    }
    const testKey = 'i18next.translate.boo';
    window.sessionStorage.setItem(testKey, 'foo');
    window.sessionStorage.removeItem(testKey);
  } catch (e) {
    hasSessionStorageSupport = false;
  }
  return hasSessionStorageSupport;
};
var sessionStorage = {
  name: 'sessionStorage',
  lookup(_ref) {
    let {
      lookupSessionStorage
    } = _ref;
    if (lookupSessionStorage && sessionStorageAvailable()) {
      return window.sessionStorage.getItem(lookupSessionStorage) || undefined;
    }
    return undefined;
  },
  cacheUserLanguage(lng, _ref2) {
    let {
      lookupSessionStorage
    } = _ref2;
    if (lookupSessionStorage && sessionStorageAvailable()) {
      window.sessionStorage.setItem(lookupSessionStorage, lng);
    }
  }
};

var navigator$1 = {
  name: 'navigator',
  lookup(options) {
    const found = [];
    if (typeof navigator !== 'undefined') {
      const {
        languages,
        userLanguage,
        language
      } = navigator;
      if (languages) {
        // chrome only; not an array, so can't use .push.apply instead of iterating
        for (let i = 0; i < languages.length; i++) {
          found.push(languages[i]);
        }
      }
      if (userLanguage) {
        found.push(userLanguage);
      }
      if (language) {
        found.push(language);
      }
    }
    return found.length > 0 ? found : undefined;
  }
};

var htmlTag = {
  name: 'htmlTag',
  // Deconstruct the options object and extract the htmlTag property
  lookup(_ref) {
    let {
      htmlTag
    } = _ref;
    let found;
    const internalHtmlTag = htmlTag || (typeof document !== 'undefined' ? document.documentElement : null);
    if (internalHtmlTag && typeof internalHtmlTag.getAttribute === 'function') {
      found = internalHtmlTag.getAttribute('lang');
    }
    return found;
  }
};

var path = {
  name: 'path',
  // Deconstruct the options object and extract the lookupFromPathIndex property
  lookup(_ref) {
    let {
      lookupFromPathIndex
    } = _ref;
    if (typeof window === 'undefined') return undefined;
    const language = window.location.pathname.match(/\/([a-zA-Z-]*)/g);
    if (!Array.isArray(language)) return undefined;
    const index = typeof lookupFromPathIndex === 'number' ? lookupFromPathIndex : 0;
    return language[index]?.replace('/', '');
  }
};

var subdomain = {
  name: 'subdomain',
  lookup(_ref) {
    let {
      lookupFromSubdomainIndex
    } = _ref;
    // If given get the subdomain index else 1
    const internalLookupFromSubdomainIndex = typeof lookupFromSubdomainIndex === 'number' ? lookupFromSubdomainIndex + 1 : 1;
    // get all matches if window.location. is existing
    // first item of match is the match itself and the second is the first group match which should be the first subdomain match
    // is the hostname no public domain get the or option of localhost
    const language = typeof window !== 'undefined' && window.location?.hostname?.match(/^(\w{2,5})\.(([a-z0-9-]{1,63}\.[a-z]{2,6})|localhost)/i);

    // if there is no match (null) return undefined
    if (!language) return undefined;
    // return the given group match
    return language[internalLookupFromSubdomainIndex];
  }
};

// some environments, throws when accessing document.cookie
let canCookies = false;
try {
  // eslint-disable-next-line no-unused-expressions
  document.cookie;
  canCookies = true;
  // eslint-disable-next-line no-empty
} catch (e) {}
const order = ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'];
if (!canCookies) order.splice(1, 1);
const getDefaults = () => ({
  order,
  lookupQuerystring: 'lng',
  lookupCookie: 'i18next',
  lookupLocalStorage: 'i18nextLng',
  lookupSessionStorage: 'i18nextLng',
  // cache user language
  caches: ['localStorage'],
  excludeCacheFor: ['cimode'],
  // cookieMinutes: 10,
  // cookieDomain: 'myDomain'

  convertDetectedLanguage: l => l
});
class Browser {
  constructor(services) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    this.type = 'languageDetector';
    this.detectors = {};
    this.init(services, options);
  }
  init() {
    let services = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      languageUtils: {}
    };
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let i18nOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    this.services = services;
    this.options = defaults(options, this.options || {}, getDefaults());
    if (typeof this.options.convertDetectedLanguage === 'string' && this.options.convertDetectedLanguage.indexOf('15897') > -1) {
      this.options.convertDetectedLanguage = l => l.replace('-', '_');
    }

    // backwards compatibility
    if (this.options.lookupFromUrlIndex) this.options.lookupFromPathIndex = this.options.lookupFromUrlIndex;
    this.i18nOptions = i18nOptions;
    this.addDetector(cookie$1);
    this.addDetector(querystring);
    this.addDetector(localStorage);
    this.addDetector(sessionStorage);
    this.addDetector(navigator$1);
    this.addDetector(htmlTag);
    this.addDetector(path);
    this.addDetector(subdomain);
    this.addDetector(hash);
  }
  addDetector(detector) {
    this.detectors[detector.name] = detector;
    return this;
  }
  detect() {
    let detectionOrder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.options.order;
    let detected = [];
    detectionOrder.forEach(detectorName => {
      if (this.detectors[detectorName]) {
        let lookup = this.detectors[detectorName].lookup(this.options);
        if (lookup && typeof lookup === 'string') lookup = [lookup];
        if (lookup) detected = detected.concat(lookup);
      }
    });
    detected = detected.filter(d => d !== undefined && d !== null && !hasXSS(d)).map(d => this.options.convertDetectedLanguage(d));
    if (this.services && this.services.languageUtils && this.services.languageUtils.getBestMatchFromCodes) return detected; // new i18next v19.5.0
    return detected.length > 0 ? detected[0] : null; // a little backward compatibility
  }
  cacheUserLanguage(lng) {
    let caches = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.options.caches;
    if (!caches) return;
    if (this.options.excludeCacheFor && this.options.excludeCacheFor.indexOf(lng) > -1) return;
    caches.forEach(cacheName => {
      if (this.detectors[cacheName]) this.detectors[cacheName].cacheUserLanguage(lng, this.options);
    });
  }
}
Browser.type = 'languageDetector';




/***/ }),

/***/ 5016:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "2ea1079c0069eb040a52.woff";

/***/ }),

/***/ 5031:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "cb04b2ee2f7d192478b8.woff2";

/***/ }),

/***/ 5037:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "5014db633e71a7741bf5.woff";

/***/ }),

/***/ 5056:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ 5072:
/***/ ((module) => {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ 5107:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ ChevronDown)
/* harmony export */ });
/* unused harmony export __iconNode */
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9407);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("chevron-down", __iconNode);


//# sourceMappingURL=chevron-down.js.map


/***/ }),

/***/ 5212:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "b9dcbca183ac93f02061.woff2";

/***/ }),

/***/ 5562:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "36e9cf9ecc07ac6bce28.woff2";

/***/ }),

/***/ 5588:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AO: () => (/* binding */ createPath),
/* harmony export */   Gh: () => (/* binding */ resolveTo),
/* harmony export */   HS: () => (/* binding */ joinPaths),
/* harmony export */   Oi: () => (/* binding */ invariant),
/* harmony export */   Rr: () => (/* binding */ parsePath),
/* harmony export */   VV: () => (/* binding */ ErrorResponseImpl),
/* harmony export */   aE: () => (/* binding */ createRouter),
/* harmony export */   pX: () => (/* binding */ isRouteErrorResponse),
/* harmony export */   pb: () => (/* binding */ stripBasename),
/* harmony export */   rc: () => (/* binding */ Action),
/* harmony export */   tH: () => (/* binding */ AbortedDeferredError),
/* harmony export */   ue: () => (/* binding */ matchRoutes),
/* harmony export */   yD: () => (/* binding */ getResolveToMatches),
/* harmony export */   zR: () => (/* binding */ createBrowserHistory)
/* harmony export */ });
/* unused harmony exports IDLE_BLOCKER, IDLE_FETCHER, IDLE_NAVIGATION, UNSAFE_DEFERRED_SYMBOL, UNSAFE_DeferredData, UNSAFE_convertRouteMatchToUiMatch, UNSAFE_convertRoutesToDataRoutes, UNSAFE_decodePath, UNSAFE_warning, createHashHistory, createMemoryHistory, createStaticHandler, data, defer, generatePath, getStaticContextFromError, getToPathname, isDataWithResponseInit, isDeferredData, json, matchPath, normalizePathname, redirect, redirectDocument, replace, resolvePath */
/**
 * @remix-run/router v1.23.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

////////////////////////////////////////////////////////////////////////////////
//#region Types and Constants
////////////////////////////////////////////////////////////////////////////////
/**
 * Actions represent the type of change to a location value.
 */
var Action;
(function (Action) {
  /**
   * A POP indicates a change to an arbitrary index in the history stack, such
   * as a back or forward navigation. It does not describe the direction of the
   * navigation, only that the current index changed.
   *
   * Note: This is the default action for newly created history objects.
   */
  Action["Pop"] = "POP";
  /**
   * A PUSH indicates a new entry being added to the history stack, such as when
   * a link is clicked and a new page loads. When this happens, all subsequent
   * entries in the stack are lost.
   */
  Action["Push"] = "PUSH";
  /**
   * A REPLACE indicates the entry at the current index in the history stack
   * being replaced by a new one.
   */
  Action["Replace"] = "REPLACE";
})(Action || (Action = {}));
const PopStateEventType = "popstate";
/**
 * Memory history stores the current location in memory. It is designed for use
 * in stateful non-browser environments like tests and React Native.
 */
function createMemoryHistory(options) {
  if (options === void 0) {
    options = {};
  }
  let {
    initialEntries = ["/"],
    initialIndex,
    v5Compat = false
  } = options;
  let entries; // Declare so we can access from createMemoryLocation
  entries = initialEntries.map((entry, index) => createMemoryLocation(entry, typeof entry === "string" ? null : entry.state, index === 0 ? "default" : undefined));
  let index = clampIndex(initialIndex == null ? entries.length - 1 : initialIndex);
  let action = Action.Pop;
  let listener = null;
  function clampIndex(n) {
    return Math.min(Math.max(n, 0), entries.length - 1);
  }
  function getCurrentLocation() {
    return entries[index];
  }
  function createMemoryLocation(to, state, key) {
    if (state === void 0) {
      state = null;
    }
    let location = createLocation(entries ? getCurrentLocation().pathname : "/", to, state, key);
    warning(location.pathname.charAt(0) === "/", "relative pathnames are not supported in memory history: " + JSON.stringify(to));
    return location;
  }
  function createHref(to) {
    return typeof to === "string" ? to : createPath(to);
  }
  let history = {
    get index() {
      return index;
    },
    get action() {
      return action;
    },
    get location() {
      return getCurrentLocation();
    },
    createHref,
    createURL(to) {
      return new URL(createHref(to), "http://localhost");
    },
    encodeLocation(to) {
      let path = typeof to === "string" ? parsePath(to) : to;
      return {
        pathname: path.pathname || "",
        search: path.search || "",
        hash: path.hash || ""
      };
    },
    push(to, state) {
      action = Action.Push;
      let nextLocation = createMemoryLocation(to, state);
      index += 1;
      entries.splice(index, entries.length, nextLocation);
      if (v5Compat && listener) {
        listener({
          action,
          location: nextLocation,
          delta: 1
        });
      }
    },
    replace(to, state) {
      action = Action.Replace;
      let nextLocation = createMemoryLocation(to, state);
      entries[index] = nextLocation;
      if (v5Compat && listener) {
        listener({
          action,
          location: nextLocation,
          delta: 0
        });
      }
    },
    go(delta) {
      action = Action.Pop;
      let nextIndex = clampIndex(index + delta);
      let nextLocation = entries[nextIndex];
      index = nextIndex;
      if (listener) {
        listener({
          action,
          location: nextLocation,
          delta
        });
      }
    },
    listen(fn) {
      listener = fn;
      return () => {
        listener = null;
      };
    }
  };
  return history;
}
/**
 * Browser history stores the location in regular URLs. This is the standard for
 * most web apps, but it requires some configuration on the server to ensure you
 * serve the same app at multiple URLs.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createbrowserhistory
 */
function createBrowserHistory(options) {
  if (options === void 0) {
    options = {};
  }
  function createBrowserLocation(window, globalHistory) {
    let {
      pathname,
      search,
      hash
    } = window.location;
    return createLocation("", {
      pathname,
      search,
      hash
    },
    // state defaults to `null` because `window.history.state` does
    globalHistory.state && globalHistory.state.usr || null, globalHistory.state && globalHistory.state.key || "default");
  }
  function createBrowserHref(window, to) {
    return typeof to === "string" ? to : createPath(to);
  }
  return getUrlBasedHistory(createBrowserLocation, createBrowserHref, null, options);
}
/**
 * Hash history stores the location in window.location.hash. This makes it ideal
 * for situations where you don't want to send the location to the server for
 * some reason, either because you do cannot configure it or the URL space is
 * reserved for something else.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createhashhistory
 */
function createHashHistory(options) {
  if (options === void 0) {
    options = {};
  }
  function createHashLocation(window, globalHistory) {
    let {
      pathname = "/",
      search = "",
      hash = ""
    } = parsePath(window.location.hash.substr(1));
    // Hash URL should always have a leading / just like window.location.pathname
    // does, so if an app ends up at a route like /#something then we add a
    // leading slash so all of our path-matching behaves the same as if it would
    // in a browser router.  This is particularly important when there exists a
    // root splat route (<Route path="*">) since that matches internally against
    // "/*" and we'd expect /#something to 404 in a hash router app.
    if (!pathname.startsWith("/") && !pathname.startsWith(".")) {
      pathname = "/" + pathname;
    }
    return createLocation("", {
      pathname,
      search,
      hash
    },
    // state defaults to `null` because `window.history.state` does
    globalHistory.state && globalHistory.state.usr || null, globalHistory.state && globalHistory.state.key || "default");
  }
  function createHashHref(window, to) {
    let base = window.document.querySelector("base");
    let href = "";
    if (base && base.getAttribute("href")) {
      let url = window.location.href;
      let hashIndex = url.indexOf("#");
      href = hashIndex === -1 ? url : url.slice(0, hashIndex);
    }
    return href + "#" + (typeof to === "string" ? to : createPath(to));
  }
  function validateHashLocation(location, to) {
    warning(location.pathname.charAt(0) === "/", "relative pathnames are not supported in hash history.push(" + JSON.stringify(to) + ")");
  }
  return getUrlBasedHistory(createHashLocation, createHashHref, validateHashLocation, options);
}
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning(cond, message) {
  if (!cond) {
    // eslint-disable-next-line no-console
    if (typeof console !== "undefined") console.warn(message);
    try {
      // Welcome to debugging history!
      //
      // This error is thrown as a convenience, so you can more easily
      // find the source for a warning that appears in the console by
      // enabling "pause on exceptions" in your JavaScript debugger.
      throw new Error(message);
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}
function createKey() {
  return Math.random().toString(36).substr(2, 8);
}
/**
 * For browser-based histories, we combine the state and key into an object
 */
function getHistoryState(location, index) {
  return {
    usr: location.state,
    key: location.key,
    idx: index
  };
}
/**
 * Creates a Location object with a unique key from the given Path
 */
function createLocation(current, to, state, key) {
  if (state === void 0) {
    state = null;
  }
  let location = _extends({
    pathname: typeof current === "string" ? current : current.pathname,
    search: "",
    hash: ""
  }, typeof to === "string" ? parsePath(to) : to, {
    state,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: to && to.key || key || createKey()
  });
  return location;
}
/**
 * Creates a string URL path from the given pathname, search, and hash components.
 */
function createPath(_ref) {
  let {
    pathname = "/",
    search = "",
    hash = ""
  } = _ref;
  if (search && search !== "?") pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#") pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
/**
 * Parses a string URL path into its separate pathname, search, and hash components.
 */
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
function getUrlBasedHistory(getLocation, createHref, validateLocation, options) {
  if (options === void 0) {
    options = {};
  }
  let {
    window = document.defaultView,
    v5Compat = false
  } = options;
  let globalHistory = window.history;
  let action = Action.Pop;
  let listener = null;
  let index = getIndex();
  // Index should only be null when we initialize. If not, it's because the
  // user called history.pushState or history.replaceState directly, in which
  // case we should log a warning as it will result in bugs.
  if (index == null) {
    index = 0;
    globalHistory.replaceState(_extends({}, globalHistory.state, {
      idx: index
    }), "");
  }
  function getIndex() {
    let state = globalHistory.state || {
      idx: null
    };
    return state.idx;
  }
  function handlePop() {
    action = Action.Pop;
    let nextIndex = getIndex();
    let delta = nextIndex == null ? null : nextIndex - index;
    index = nextIndex;
    if (listener) {
      listener({
        action,
        location: history.location,
        delta
      });
    }
  }
  function push(to, state) {
    action = Action.Push;
    let location = createLocation(history.location, to, state);
    if (validateLocation) validateLocation(location, to);
    index = getIndex() + 1;
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    // try...catch because iOS limits us to 100 pushState calls :/
    try {
      globalHistory.pushState(historyState, "", url);
    } catch (error) {
      // If the exception is because `state` can't be serialized, let that throw
      // outwards just like a replace call would so the dev knows the cause
      // https://html.spec.whatwg.org/multipage/nav-history-apis.html#shared-history-push/replace-state-steps
      // https://html.spec.whatwg.org/multipage/structured-data.html#structuredserializeinternal
      if (error instanceof DOMException && error.name === "DataCloneError") {
        throw error;
      }
      // They are going to lose state here, but there is no real
      // way to warn them about it since the page will refresh...
      window.location.assign(url);
    }
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 1
      });
    }
  }
  function replace(to, state) {
    action = Action.Replace;
    let location = createLocation(history.location, to, state);
    if (validateLocation) validateLocation(location, to);
    index = getIndex();
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    globalHistory.replaceState(historyState, "", url);
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 0
      });
    }
  }
  function createURL(to) {
    // window.location.origin is "null" (the literal string value) in Firefox
    // under certain conditions, notably when serving from a local HTML file
    // See https://bugzilla.mozilla.org/show_bug.cgi?id=878297
    let base = window.location.origin !== "null" ? window.location.origin : window.location.href;
    let href = typeof to === "string" ? to : createPath(to);
    // Treating this as a full URL will strip any trailing spaces so we need to
    // pre-encode them since they might be part of a matching splat param from
    // an ancestor route
    href = href.replace(/ $/, "%20");
    invariant(base, "No window.location.(origin|href) available to create URL for href: " + href);
    return new URL(href, base);
  }
  let history = {
    get action() {
      return action;
    },
    get location() {
      return getLocation(window, globalHistory);
    },
    listen(fn) {
      if (listener) {
        throw new Error("A history only accepts one active listener");
      }
      window.addEventListener(PopStateEventType, handlePop);
      listener = fn;
      return () => {
        window.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },
    createHref(to) {
      return createHref(window, to);
    },
    createURL,
    encodeLocation(to) {
      // Encode a Location the same way window.location would
      let url = createURL(to);
      return {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash
      };
    },
    push,
    replace,
    go(n) {
      return globalHistory.go(n);
    }
  };
  return history;
}
//#endregion

var ResultType;
(function (ResultType) {
  ResultType["data"] = "data";
  ResultType["deferred"] = "deferred";
  ResultType["redirect"] = "redirect";
  ResultType["error"] = "error";
})(ResultType || (ResultType = {}));
const immutableRouteKeys = new Set(["lazy", "caseSensitive", "path", "id", "index", "children"]);
function isIndexRoute(route) {
  return route.index === true;
}
// Walk the route tree generating unique IDs where necessary, so we are working
// solely with AgnosticDataRouteObject's within the Router
function convertRoutesToDataRoutes(routes, mapRouteProperties, parentPath, manifest) {
  if (parentPath === void 0) {
    parentPath = [];
  }
  if (manifest === void 0) {
    manifest = {};
  }
  return routes.map((route, index) => {
    let treePath = [...parentPath, String(index)];
    let id = typeof route.id === "string" ? route.id : treePath.join("-");
    invariant(route.index !== true || !route.children, "Cannot specify children on an index route");
    invariant(!manifest[id], "Found a route id collision on id \"" + id + "\".  Route " + "id's must be globally unique within Data Router usages");
    if (isIndexRoute(route)) {
      let indexRoute = _extends({}, route, mapRouteProperties(route), {
        id
      });
      manifest[id] = indexRoute;
      return indexRoute;
    } else {
      let pathOrLayoutRoute = _extends({}, route, mapRouteProperties(route), {
        id,
        children: undefined
      });
      manifest[id] = pathOrLayoutRoute;
      if (route.children) {
        pathOrLayoutRoute.children = convertRoutesToDataRoutes(route.children, mapRouteProperties, treePath, manifest);
      }
      return pathOrLayoutRoute;
    }
  });
}
/**
 * Matches the given routes to a location and returns the match data.
 *
 * @see https://reactrouter.com/v6/utils/match-routes
 */
function matchRoutes(routes, locationArg, basename) {
  if (basename === void 0) {
    basename = "/";
  }
  return matchRoutesImpl(routes, locationArg, basename, false);
}
function matchRoutesImpl(routes, locationArg, basename, allowPartial) {
  let location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);
  let matches = null;
  for (let i = 0; matches == null && i < branches.length; ++i) {
    // Incoming pathnames are generally encoded from either window.location
    // or from router.navigate, but we want to match against the unencoded
    // paths in the route definitions.  Memory router locations won't be
    // encoded here but there also shouldn't be anything to decode so this
    // should be a safe operation.  This avoids needing matchRoutes to be
    // history-aware.
    let decoded = decodePath(pathname);
    matches = matchRouteBranch(branches[i], decoded, allowPartial);
  }
  return matches;
}
function convertRouteMatchToUiMatch(match, loaderData) {
  let {
    route,
    pathname,
    params
  } = match;
  return {
    id: route.id,
    pathname,
    params,
    data: loaderData[route.id],
    handle: route.handle
  };
}
function flattenRoutes(routes, branches, parentsMeta, parentPath) {
  if (branches === void 0) {
    branches = [];
  }
  if (parentsMeta === void 0) {
    parentsMeta = [];
  }
  if (parentPath === void 0) {
    parentPath = "";
  }
  let flattenRoute = (route, index, relativePath) => {
    let meta = {
      relativePath: relativePath === undefined ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      invariant(meta.relativePath.startsWith(parentPath), "Absolute route path \"" + meta.relativePath + "\" nested under path " + ("\"" + parentPath + "\" is not valid. An absolute child route path ") + "must start with the combined path of all its parent routes.");
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    // Add the children before adding this route to the array, so we traverse the
    // route tree depth-first and child routes appear before their parents in
    // the "flattened" version.
    if (route.children && route.children.length > 0) {
      invariant(
      // Our types know better, but runtime JS may not!
      // @ts-expect-error
      route.index !== true, "Index routes must not have child routes. Please remove " + ("all child routes from route path \"" + path + "\"."));
      flattenRoutes(route.children, branches, routesMeta, path);
    }
    // Routes without a path shouldn't ever match by themselves unless they are
    // index routes, so don't add them to the list of possible branches.
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes.forEach((route, index) => {
    var _route$path;
    // coarse-grain check for optional params
    if (route.path === "" || !((_route$path = route.path) != null && _route$path.includes("?"))) {
      flattenRoute(route, index);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index, exploded);
      }
    }
  });
  return branches;
}
/**
 * Computes all combinations of optional path segments for a given path,
 * excluding combinations that are ambiguous and of lower priority.
 *
 * For example, `/one/:two?/three/:four?/:five?` explodes to:
 * - `/one/three`
 * - `/one/:two/three`
 * - `/one/three/:four`
 * - `/one/three/:five`
 * - `/one/:two/three/:four`
 * - `/one/:two/three/:five`
 * - `/one/three/:four/:five`
 * - `/one/:two/three/:four/:five`
 */
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0) return [];
  let [first, ...rest] = segments;
  // Optional path segments are denoted by a trailing `?`
  let isOptional = first.endsWith("?");
  // Compute the corresponding required segment: `foo?` -> `foo`
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    // Intepret empty string as omitting an optional segment
    // `["one", "", "three"]` corresponds to omitting `:two` from `/one/:two?/three` -> `/one/three`
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  // All child paths with the prefix.  Do this for all children before the
  // optional version for all children, so we get consistent ordering where the
  // parent optional aspect is preferred as required.  Otherwise, we can get
  // child sections interspersed where deeper optional segments are higher than
  // parent optional segments, where for example, /:two would explode _earlier_
  // then /:one.  By always including the parent as required _for all children_
  // first, we avoid this issue
  result.push(...restExploded.map(subpath => subpath === "" ? required : [required, subpath].join("/")));
  // Then, if this is an optional value, add all child versions without
  if (isOptional) {
    result.push(...restExploded);
  }
  // for absolute paths, ensure `/` instead of empty segment
  return result.map(exploded => path.startsWith("/") && exploded === "" ? "/" : exploded);
}
function rankRouteBranches(branches) {
  branches.sort((a, b) => a.score !== b.score ? b.score - a.score // Higher score first
  : compareIndexes(a.routesMeta.map(meta => meta.childrenIndex), b.routesMeta.map(meta => meta.childrenIndex)));
}
const paramRe = /^:[\w-]+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;
const isSplat = s => s === "*";
function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index) {
    initialScore += indexRouteValue;
  }
  return segments.filter(s => !isSplat(s)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
}
function compareIndexes(a, b) {
  let siblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
  return siblings ?
  // If two routes are siblings, we should try to match the earlier sibling
  // first. This allows people to have fine-grained control over the matching
  // behavior by simply putting routes with identical paths in the order they
  // want them tried.
  a[a.length - 1] - b[b.length - 1] :
  // Otherwise, it doesn't really make sense to rank non-siblings by index,
  // so they sort equally.
  0;
}
function matchRouteBranch(branch, pathname, allowPartial) {
  if (allowPartial === void 0) {
    allowPartial = false;
  }
  let {
    routesMeta
  } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath({
      path: meta.relativePath,
      caseSensitive: meta.caseSensitive,
      end
    }, remainingPathname);
    let route = meta.route;
    if (!match && end && allowPartial && !routesMeta[routesMeta.length - 1].route.index) {
      match = matchPath({
        path: meta.relativePath,
        caseSensitive: meta.caseSensitive,
        end: false
      }, remainingPathname);
    }
    if (!match) {
      return null;
    }
    Object.assign(matchedParams, match.params);
    matches.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
/**
 * Returns a path with params interpolated.
 *
 * @see https://reactrouter.com/v6/utils/generate-path
 */
function generatePath(originalPath, params) {
  if (params === void 0) {
    params = {};
  }
  let path = originalPath;
  if (path.endsWith("*") && path !== "*" && !path.endsWith("/*")) {
    warning(false, "Route path \"" + path + "\" will be treated as if it were " + ("\"" + path.replace(/\*$/, "/*") + "\" because the `*` character must ") + "always follow a `/` in the pattern. To get rid of this warning, " + ("please change the route path to \"" + path.replace(/\*$/, "/*") + "\"."));
    path = path.replace(/\*$/, "/*");
  }
  // ensure `/` is added at the beginning if the path is absolute
  const prefix = path.startsWith("/") ? "/" : "";
  const stringify = p => p == null ? "" : typeof p === "string" ? p : String(p);
  const segments = path.split(/\/+/).map((segment, index, array) => {
    const isLastSegment = index === array.length - 1;
    // only apply the splat if it's the last segment
    if (isLastSegment && segment === "*") {
      const star = "*";
      // Apply the splat
      return stringify(params[star]);
    }
    const keyMatch = segment.match(/^:([\w-]+)(\??)$/);
    if (keyMatch) {
      const [, key, optional] = keyMatch;
      let param = params[key];
      invariant(optional === "?" || param != null, "Missing \":" + key + "\" param");
      return stringify(param);
    }
    // Remove any optional markers from optional static segments
    return segment.replace(/\?$/g, "");
  })
  // Remove empty segments
  .filter(segment => !!segment);
  return prefix + segments.join("/");
}
/**
 * Performs pattern matching on a URL pathname and returns information about
 * the match.
 *
 * @see https://reactrouter.com/v6/utils/match-path
 */
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = {
      path: pattern,
      caseSensitive: false,
      end: true
    };
  }
  let [matcher, compiledParams] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
  let match = pathname.match(matcher);
  if (!match) return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = compiledParams.reduce((memo, _ref, index) => {
    let {
      paramName,
      isOptional
    } = _ref;
    // We need to compute the pathnameBase here using the raw splat value
    // instead of using params["*"] later because it will be decoded then
    if (paramName === "*") {
      let splatValue = captureGroups[index] || "";
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
    }
    const value = captureGroups[index];
    if (isOptional && !value) {
      memo[paramName] = undefined;
    } else {
      memo[paramName] = (value || "").replace(/%2F/g, "/");
    }
    return memo;
  }, {});
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive, end) {
  if (caseSensitive === void 0) {
    caseSensitive = false;
  }
  if (end === void 0) {
    end = true;
  }
  warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), "Route path \"" + path + "\" will be treated as if it were " + ("\"" + path.replace(/\*$/, "/*") + "\" because the `*` character must ") + "always follow a `/` in the pattern. To get rid of this warning, " + ("please change the route path to \"" + path.replace(/\*$/, "/*") + "\"."));
  let params = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "") // Ignore trailing / and /*, we'll handle it below
  .replace(/^\/*/, "/") // Make sure it has a leading /
  .replace(/[\\.*+^${}|()[\]]/g, "\\$&") // Escape special regex chars
  .replace(/\/:([\w-]+)(\?)?/g, (_, paramName, isOptional) => {
    params.push({
      paramName,
      isOptional: isOptional != null
    });
    return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
  });
  if (path.endsWith("*")) {
    params.push({
      paramName: "*"
    });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" // Already matched the initial /, just match the rest
    : "(?:\\/(.+)|\\/*)$"; // Don't include the / in params["*"]
  } else if (end) {
    // When matching to the end, ignore trailing slashes
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    // If our path is non-empty and contains anything beyond an initial slash,
    // then we have _some_ form of path in our regex, so we should expect to
    // match only if we find the end of this path segment.  Look for an optional
    // non-captured trailing slash (to match a portion of the URL) or the end
    // of the path (if we've matched to the end).  We used to do this with a
    // word boundary but that gives false positives on routes like
    // /user-preferences since `-` counts as a word boundary.
    regexpSource += "(?:(?=\\/|$))";
  } else ;
  let matcher = new RegExp(regexpSource, caseSensitive ? undefined : "i");
  return [matcher, params];
}
function decodePath(value) {
  try {
    return value.split("/").map(v => decodeURIComponent(v).replace(/\//g, "%2F")).join("/");
  } catch (error) {
    warning(false, "The URL path \"" + value + "\" could not be decoded because it is is a " + "malformed URL segment. This is probably due to a bad percent " + ("encoding (" + error + ")."));
    return value;
  }
}
/**
 * @private
 */
function stripBasename(pathname, basename) {
  if (basename === "/") return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  // We want to leave trailing slash behavior in the user's control, so if they
  // specify a basename with a trailing slash, we should support it
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    // pathname does not start with basename/
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
/**
 * Returns a resolved path object relative to the given pathname.
 *
 * @see https://reactrouter.com/v6/utils/resolve-path
 */
function resolvePath(to, fromPathname) {
  if (fromPathname === void 0) {
    fromPathname = "/";
  }
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  let pathname = toPathname ? toPathname.startsWith("/") ? toPathname : resolvePathname(toPathname, fromPathname) : fromPathname;
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach(segment => {
    if (segment === "..") {
      // Keep the root "" segment so the pathname starts at /
      if (segments.length > 1) segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
  return "Cannot include a '" + char + "' character in a manually specified " + ("`to." + field + "` field [" + JSON.stringify(path) + "].  Please separate it out to the ") + ("`to." + dest + "` field. Alternatively you may provide the full path as ") + "a string in <Link to=\"...\"> and the router will parse it for you.";
}
/**
 * @private
 *
 * When processing relative navigation we want to ignore ancestor routes that
 * do not contribute to the path, such that index/pathless layout routes don't
 * interfere.
 *
 * For example, when moving a route element into an index route and/or a
 * pathless layout route, relative link behavior contained within should stay
 * the same.  Both of the following examples should link back to the root:
 *
 *   <Route path="/">
 *     <Route path="accounts" element={<Link to=".."}>
 *   </Route>
 *
 *   <Route path="/">
 *     <Route path="accounts">
 *       <Route element={<AccountsLayout />}>       // <-- Does not contribute
 *         <Route index element={<Link to=".."} />  // <-- Does not contribute
 *       </Route
 *     </Route>
 *   </Route>
 */
function getPathContributingMatches(matches) {
  return matches.filter((match, index) => index === 0 || match.route.path && match.route.path.length > 0);
}
// Return the array of pathnames for the current route matches - used to
// generate the routePathnames input for resolveTo()
function getResolveToMatches(matches, v7_relativeSplatPath) {
  let pathMatches = getPathContributingMatches(matches);
  // When v7_relativeSplatPath is enabled, use the full pathname for the leaf
  // match so we include splat values for "." links.  See:
  // https://github.com/remix-run/react-router/issues/11052#issuecomment-1836589329
  if (v7_relativeSplatPath) {
    return pathMatches.map((match, idx) => idx === pathMatches.length - 1 ? match.pathname : match.pathnameBase);
  }
  return pathMatches.map(match => match.pathnameBase);
}
/**
 * @private
 */
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative) {
  if (isPathRelative === void 0) {
    isPathRelative = false;
  }
  let to;
  if (typeof toArg === "string") {
    to = parsePath(toArg);
  } else {
    to = _extends({}, toArg);
    invariant(!to.pathname || !to.pathname.includes("?"), getInvalidPathError("?", "pathname", "search", to));
    invariant(!to.pathname || !to.pathname.includes("#"), getInvalidPathError("#", "pathname", "hash", to));
    invariant(!to.search || !to.search.includes("#"), getInvalidPathError("#", "search", "hash", to));
  }
  let isEmptyPath = toArg === "" || to.pathname === "";
  let toPathname = isEmptyPath ? "/" : to.pathname;
  let from;
  // Routing is relative to the current pathname if explicitly requested.
  //
  // If a pathname is explicitly provided in `to`, it should be relative to the
  // route context. This is explained in `Note on `<Link to>` values` in our
  // migration guide from v5 as a means of disambiguation between `to` values
  // that begin with `/` and those that do not. However, this is problematic for
  // `to` values that do not provide a pathname. `to` can simply be a search or
  // hash string, in which case we should assume that the navigation is relative
  // to the current location's pathname and *not* the route pathname.
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    // With relative="route" (the default), each leading .. segment means
    // "go up one route" instead of "go up one URL segment".  This is a key
    // difference from how <a href> works and a major reason we call this a
    // "to" value instead of a "href".
    if (!isPathRelative && toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to.pathname = toSegments.join("/");
    }
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from);
  // Ensure the pathname has a trailing slash if the original "to" had one
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  // Or if this was a link to the current path which has a trailing slash
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
/**
 * @private
 */
function getToPathname(to) {
  // Empty strings should be treated the same as / paths
  return to === "" || to.pathname === "" ? "/" : typeof to === "string" ? parsePath(to).pathname : to.pathname;
}
/**
 * @private
 */
const joinPaths = paths => paths.join("/").replace(/\/\/+/g, "/");
/**
 * @private
 */
const normalizePathname = pathname => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
/**
 * @private
 */
const normalizeSearch = search => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
/**
 * @private
 */
const normalizeHash = hash => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
/**
 * This is a shortcut for creating `application/json` responses. Converts `data`
 * to JSON and sets the `Content-Type` header.
 *
 * @deprecated The `json` method is deprecated in favor of returning raw objects.
 * This method will be removed in v7.
 */
const json = function json(data, init) {
  if (init === void 0) {
    init = {};
  }
  let responseInit = typeof init === "number" ? {
    status: init
  } : init;
  let headers = new Headers(responseInit.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }
  return new Response(JSON.stringify(data), _extends({}, responseInit, {
    headers
  }));
};
class DataWithResponseInit {
  constructor(data, init) {
    this.type = "DataWithResponseInit";
    this.data = data;
    this.init = init || null;
  }
}
/**
 * Create "responses" that contain `status`/`headers` without forcing
 * serialization into an actual `Response` - used by Remix single fetch
 */
function data(data, init) {
  return new DataWithResponseInit(data, typeof init === "number" ? {
    status: init
  } : init);
}
class AbortedDeferredError extends Error {}
class DeferredData {
  constructor(data, responseInit) {
    this.pendingKeysSet = new Set();
    this.subscribers = new Set();
    this.deferredKeys = [];
    invariant(data && typeof data === "object" && !Array.isArray(data), "defer() only accepts plain objects");
    // Set up an AbortController + Promise we can race against to exit early
    // cancellation
    let reject;
    this.abortPromise = new Promise((_, r) => reject = r);
    this.controller = new AbortController();
    let onAbort = () => reject(new AbortedDeferredError("Deferred data aborted"));
    this.unlistenAbortSignal = () => this.controller.signal.removeEventListener("abort", onAbort);
    this.controller.signal.addEventListener("abort", onAbort);
    this.data = Object.entries(data).reduce((acc, _ref2) => {
      let [key, value] = _ref2;
      return Object.assign(acc, {
        [key]: this.trackPromise(key, value)
      });
    }, {});
    if (this.done) {
      // All incoming values were resolved
      this.unlistenAbortSignal();
    }
    this.init = responseInit;
  }
  trackPromise(key, value) {
    if (!(value instanceof Promise)) {
      return value;
    }
    this.deferredKeys.push(key);
    this.pendingKeysSet.add(key);
    // We store a little wrapper promise that will be extended with
    // _data/_error props upon resolve/reject
    let promise = Promise.race([value, this.abortPromise]).then(data => this.onSettle(promise, key, undefined, data), error => this.onSettle(promise, key, error));
    // Register rejection listeners to avoid uncaught promise rejections on
    // errors or aborted deferred values
    promise.catch(() => {});
    Object.defineProperty(promise, "_tracked", {
      get: () => true
    });
    return promise;
  }
  onSettle(promise, key, error, data) {
    if (this.controller.signal.aborted && error instanceof AbortedDeferredError) {
      this.unlistenAbortSignal();
      Object.defineProperty(promise, "_error", {
        get: () => error
      });
      return Promise.reject(error);
    }
    this.pendingKeysSet.delete(key);
    if (this.done) {
      // Nothing left to abort!
      this.unlistenAbortSignal();
    }
    // If the promise was resolved/rejected with undefined, we'll throw an error as you
    // should always resolve with a value or null
    if (error === undefined && data === undefined) {
      let undefinedError = new Error("Deferred data for key \"" + key + "\" resolved/rejected with `undefined`, " + "you must resolve/reject with a value or `null`.");
      Object.defineProperty(promise, "_error", {
        get: () => undefinedError
      });
      this.emit(false, key);
      return Promise.reject(undefinedError);
    }
    if (data === undefined) {
      Object.defineProperty(promise, "_error", {
        get: () => error
      });
      this.emit(false, key);
      return Promise.reject(error);
    }
    Object.defineProperty(promise, "_data", {
      get: () => data
    });
    this.emit(false, key);
    return data;
  }
  emit(aborted, settledKey) {
    this.subscribers.forEach(subscriber => subscriber(aborted, settledKey));
  }
  subscribe(fn) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }
  cancel() {
    this.controller.abort();
    this.pendingKeysSet.forEach((v, k) => this.pendingKeysSet.delete(k));
    this.emit(true);
  }
  async resolveData(signal) {
    let aborted = false;
    if (!this.done) {
      let onAbort = () => this.cancel();
      signal.addEventListener("abort", onAbort);
      aborted = await new Promise(resolve => {
        this.subscribe(aborted => {
          signal.removeEventListener("abort", onAbort);
          if (aborted || this.done) {
            resolve(aborted);
          }
        });
      });
    }
    return aborted;
  }
  get done() {
    return this.pendingKeysSet.size === 0;
  }
  get unwrappedData() {
    invariant(this.data !== null && this.done, "Can only unwrap data on initialized and settled deferreds");
    return Object.entries(this.data).reduce((acc, _ref3) => {
      let [key, value] = _ref3;
      return Object.assign(acc, {
        [key]: unwrapTrackedPromise(value)
      });
    }, {});
  }
  get pendingKeys() {
    return Array.from(this.pendingKeysSet);
  }
}
function isTrackedPromise(value) {
  return value instanceof Promise && value._tracked === true;
}
function unwrapTrackedPromise(value) {
  if (!isTrackedPromise(value)) {
    return value;
  }
  if (value._error) {
    throw value._error;
  }
  return value._data;
}
/**
 * @deprecated The `defer` method is deprecated in favor of returning raw
 * objects. This method will be removed in v7.
 */
const defer = function defer(data, init) {
  if (init === void 0) {
    init = {};
  }
  let responseInit = typeof init === "number" ? {
    status: init
  } : init;
  return new DeferredData(data, responseInit);
};
/**
 * A redirect response. Sets the status code and the `Location` header.
 * Defaults to "302 Found".
 */
const redirect = function redirect(url, init) {
  if (init === void 0) {
    init = 302;
  }
  let responseInit = init;
  if (typeof responseInit === "number") {
    responseInit = {
      status: responseInit
    };
  } else if (typeof responseInit.status === "undefined") {
    responseInit.status = 302;
  }
  let headers = new Headers(responseInit.headers);
  headers.set("Location", url);
  return new Response(null, _extends({}, responseInit, {
    headers
  }));
};
/**
 * A redirect response that will force a document reload to the new location.
 * Sets the status code and the `Location` header.
 * Defaults to "302 Found".
 */
const redirectDocument = (url, init) => {
  let response = redirect(url, init);
  response.headers.set("X-Remix-Reload-Document", "true");
  return response;
};
/**
 * A redirect response that will perform a `history.replaceState` instead of a
 * `history.pushState` for client-side navigation redirects.
 * Sets the status code and the `Location` header.
 * Defaults to "302 Found".
 */
const replace = (url, init) => {
  let response = redirect(url, init);
  response.headers.set("X-Remix-Replace", "true");
  return response;
};
/**
 * @private
 * Utility class we use to hold auto-unwrapped 4xx/5xx Response bodies
 *
 * We don't export the class for public use since it's an implementation
 * detail, but we export the interface above so folks can build their own
 * abstractions around instances via isRouteErrorResponse()
 */
class ErrorResponseImpl {
  constructor(status, statusText, data, internal) {
    if (internal === void 0) {
      internal = false;
    }
    this.status = status;
    this.statusText = statusText || "";
    this.internal = internal;
    if (data instanceof Error) {
      this.data = data.toString();
      this.error = data;
    } else {
      this.data = data;
    }
  }
}
/**
 * Check if the given error is an ErrorResponse generated from a 4xx/5xx
 * Response thrown from an action/loader
 */
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}

const validMutationMethodsArr = ["post", "put", "patch", "delete"];
const validMutationMethods = new Set(validMutationMethodsArr);
const validRequestMethodsArr = ["get", ...validMutationMethodsArr];
const validRequestMethods = new Set(validRequestMethodsArr);
const redirectStatusCodes = new Set([301, 302, 303, 307, 308]);
const redirectPreserveMethodStatusCodes = new Set([307, 308]);
const IDLE_NAVIGATION = {
  state: "idle",
  location: undefined,
  formMethod: undefined,
  formAction: undefined,
  formEncType: undefined,
  formData: undefined,
  json: undefined,
  text: undefined
};
const IDLE_FETCHER = {
  state: "idle",
  data: undefined,
  formMethod: undefined,
  formAction: undefined,
  formEncType: undefined,
  formData: undefined,
  json: undefined,
  text: undefined
};
const IDLE_BLOCKER = {
  state: "unblocked",
  proceed: undefined,
  reset: undefined,
  location: undefined
};
const ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const defaultMapRouteProperties = route => ({
  hasErrorBoundary: Boolean(route.hasErrorBoundary)
});
const TRANSITIONS_STORAGE_KEY = "remix-router-transitions";
//#endregion
////////////////////////////////////////////////////////////////////////////////
//#region createRouter
////////////////////////////////////////////////////////////////////////////////
/**
 * Create a router and listen to history POP navigations
 */
function createRouter(init) {
  const routerWindow = init.window ? init.window : typeof window !== "undefined" ? window : undefined;
  const isBrowser = typeof routerWindow !== "undefined" && typeof routerWindow.document !== "undefined" && typeof routerWindow.document.createElement !== "undefined";
  const isServer = !isBrowser;
  invariant(init.routes.length > 0, "You must provide a non-empty routes array to createRouter");
  let mapRouteProperties;
  if (init.mapRouteProperties) {
    mapRouteProperties = init.mapRouteProperties;
  } else if (init.detectErrorBoundary) {
    // If they are still using the deprecated version, wrap it with the new API
    let detectErrorBoundary = init.detectErrorBoundary;
    mapRouteProperties = route => ({
      hasErrorBoundary: detectErrorBoundary(route)
    });
  } else {
    mapRouteProperties = defaultMapRouteProperties;
  }
  // Routes keyed by ID
  let manifest = {};
  // Routes in tree format for matching
  let dataRoutes = convertRoutesToDataRoutes(init.routes, mapRouteProperties, undefined, manifest);
  let inFlightDataRoutes;
  let basename = init.basename || "/";
  let dataStrategyImpl = init.dataStrategy || defaultDataStrategy;
  let patchRoutesOnNavigationImpl = init.patchRoutesOnNavigation;
  // Config driven behavior flags
  let future = _extends({
    v7_fetcherPersist: false,
    v7_normalizeFormMethod: false,
    v7_partialHydration: false,
    v7_prependBasename: false,
    v7_relativeSplatPath: false,
    v7_skipActionErrorRevalidation: false
  }, init.future);
  // Cleanup function for history
  let unlistenHistory = null;
  // Externally-provided functions to call on all state changes
  let subscribers = new Set();
  // Externally-provided object to hold scroll restoration locations during routing
  let savedScrollPositions = null;
  // Externally-provided function to get scroll restoration keys
  let getScrollRestorationKey = null;
  // Externally-provided function to get current scroll position
  let getScrollPosition = null;
  // One-time flag to control the initial hydration scroll restoration.  Because
  // we don't get the saved positions from <ScrollRestoration /> until _after_
  // the initial render, we need to manually trigger a separate updateState to
  // send along the restoreScrollPosition
  // Set to true if we have `hydrationData` since we assume we were SSR'd and that
  // SSR did the initial scroll restoration.
  let initialScrollRestored = init.hydrationData != null;
  let initialMatches = matchRoutes(dataRoutes, init.history.location, basename);
  let initialMatchesIsFOW = false;
  let initialErrors = null;
  if (initialMatches == null && !patchRoutesOnNavigationImpl) {
    // If we do not match a user-provided-route, fall back to the root
    // to allow the error boundary to take over
    let error = getInternalRouterError(404, {
      pathname: init.history.location.pathname
    });
    let {
      matches,
      route
    } = getShortCircuitMatches(dataRoutes);
    initialMatches = matches;
    initialErrors = {
      [route.id]: error
    };
  }
  // In SPA apps, if the user provided a patchRoutesOnNavigation implementation and
  // our initial match is a splat route, clear them out so we run through lazy
  // discovery on hydration in case there's a more accurate lazy route match.
  // In SSR apps (with `hydrationData`), we expect that the server will send
  // up the proper matched routes so we don't want to run lazy discovery on
  // initial hydration and want to hydrate into the splat route.
  if (initialMatches && !init.hydrationData) {
    let fogOfWar = checkFogOfWar(initialMatches, dataRoutes, init.history.location.pathname);
    if (fogOfWar.active) {
      initialMatches = null;
    }
  }
  let initialized;
  if (!initialMatches) {
    initialized = false;
    initialMatches = [];
    // If partial hydration and fog of war is enabled, we will be running
    // `patchRoutesOnNavigation` during hydration so include any partial matches as
    // the initial matches so we can properly render `HydrateFallback`'s
    if (future.v7_partialHydration) {
      let fogOfWar = checkFogOfWar(null, dataRoutes, init.history.location.pathname);
      if (fogOfWar.active && fogOfWar.matches) {
        initialMatchesIsFOW = true;
        initialMatches = fogOfWar.matches;
      }
    }
  } else if (initialMatches.some(m => m.route.lazy)) {
    // All initialMatches need to be loaded before we're ready.  If we have lazy
    // functions around still then we'll need to run them in initialize()
    initialized = false;
  } else if (!initialMatches.some(m => m.route.loader)) {
    // If we've got no loaders to run, then we're good to go
    initialized = true;
  } else if (future.v7_partialHydration) {
    // If partial hydration is enabled, we're initialized so long as we were
    // provided with hydrationData for every route with a loader, and no loaders
    // were marked for explicit hydration
    let loaderData = init.hydrationData ? init.hydrationData.loaderData : null;
    let errors = init.hydrationData ? init.hydrationData.errors : null;
    // If errors exist, don't consider routes below the boundary
    if (errors) {
      let idx = initialMatches.findIndex(m => errors[m.route.id] !== undefined);
      initialized = initialMatches.slice(0, idx + 1).every(m => !shouldLoadRouteOnHydration(m.route, loaderData, errors));
    } else {
      initialized = initialMatches.every(m => !shouldLoadRouteOnHydration(m.route, loaderData, errors));
    }
  } else {
    // Without partial hydration - we're initialized if we were provided any
    // hydrationData - which is expected to be complete
    initialized = init.hydrationData != null;
  }
  let router;
  let state = {
    historyAction: init.history.action,
    location: init.history.location,
    matches: initialMatches,
    initialized,
    navigation: IDLE_NAVIGATION,
    // Don't restore on initial updateState() if we were SSR'd
    restoreScrollPosition: init.hydrationData != null ? false : null,
    preventScrollReset: false,
    revalidation: "idle",
    loaderData: init.hydrationData && init.hydrationData.loaderData || {},
    actionData: init.hydrationData && init.hydrationData.actionData || null,
    errors: init.hydrationData && init.hydrationData.errors || initialErrors,
    fetchers: new Map(),
    blockers: new Map()
  };
  // -- Stateful internal variables to manage navigations --
  // Current navigation in progress (to be committed in completeNavigation)
  let pendingAction = Action.Pop;
  // Should the current navigation prevent the scroll reset if scroll cannot
  // be restored?
  let pendingPreventScrollReset = false;
  // AbortController for the active navigation
  let pendingNavigationController;
  // Should the current navigation enable document.startViewTransition?
  let pendingViewTransitionEnabled = false;
  // Store applied view transitions so we can apply them on POP
  let appliedViewTransitions = new Map();
  // Cleanup function for persisting applied transitions to sessionStorage
  let removePageHideEventListener = null;
  // We use this to avoid touching history in completeNavigation if a
  // revalidation is entirely uninterrupted
  let isUninterruptedRevalidation = false;
  // Use this internal flag to force revalidation of all loaders:
  //  - submissions (completed or interrupted)
  //  - useRevalidator()
  //  - X-Remix-Revalidate (from redirect)
  let isRevalidationRequired = false;
  // Use this internal array to capture routes that require revalidation due
  // to a cancelled deferred on action submission
  let cancelledDeferredRoutes = [];
  // Use this internal array to capture fetcher loads that were cancelled by an
  // action navigation and require revalidation
  let cancelledFetcherLoads = new Set();
  // AbortControllers for any in-flight fetchers
  let fetchControllers = new Map();
  // Track loads based on the order in which they started
  let incrementingLoadId = 0;
  // Track the outstanding pending navigation data load to be compared against
  // the globally incrementing load when a fetcher load lands after a completed
  // navigation
  let pendingNavigationLoadId = -1;
  // Fetchers that triggered data reloads as a result of their actions
  let fetchReloadIds = new Map();
  // Fetchers that triggered redirect navigations
  let fetchRedirectIds = new Set();
  // Most recent href/match for fetcher.load calls for fetchers
  let fetchLoadMatches = new Map();
  // Ref-count mounted fetchers so we know when it's ok to clean them up
  let activeFetchers = new Map();
  // Fetchers that have requested a delete when using v7_fetcherPersist,
  // they'll be officially removed after they return to idle
  let deletedFetchers = new Set();
  // Store DeferredData instances for active route matches.  When a
  // route loader returns defer() we stick one in here.  Then, when a nested
  // promise resolves we update loaderData.  If a new navigation starts we
  // cancel active deferreds for eliminated routes.
  let activeDeferreds = new Map();
  // Store blocker functions in a separate Map outside of router state since
  // we don't need to update UI state if they change
  let blockerFunctions = new Map();
  // Flag to ignore the next history update, so we can revert the URL change on
  // a POP navigation that was blocked by the user without touching router state
  let unblockBlockerHistoryUpdate = undefined;
  // Initialize the router, all side effects should be kicked off from here.
  // Implemented as a Fluent API for ease of:
  //   let router = createRouter(init).initialize();
  function initialize() {
    // If history informs us of a POP navigation, start the navigation but do not update
    // state.  We'll update our own state once the navigation completes
    unlistenHistory = init.history.listen(_ref => {
      let {
        action: historyAction,
        location,
        delta
      } = _ref;
      // Ignore this event if it was just us resetting the URL from a
      // blocked POP navigation
      if (unblockBlockerHistoryUpdate) {
        unblockBlockerHistoryUpdate();
        unblockBlockerHistoryUpdate = undefined;
        return;
      }
      warning(blockerFunctions.size === 0 || delta != null, "You are trying to use a blocker on a POP navigation to a location " + "that was not created by @remix-run/router. This will fail silently in " + "production. This can happen if you are navigating outside the router " + "via `window.history.pushState`/`window.location.hash` instead of using " + "router navigation APIs.  This can also happen if you are using " + "createHashRouter and the user manually changes the URL.");
      let blockerKey = shouldBlockNavigation({
        currentLocation: state.location,
        nextLocation: location,
        historyAction
      });
      if (blockerKey && delta != null) {
        // Restore the URL to match the current UI, but don't update router state
        let nextHistoryUpdatePromise = new Promise(resolve => {
          unblockBlockerHistoryUpdate = resolve;
        });
        init.history.go(delta * -1);
        // Put the blocker into a blocked state
        updateBlocker(blockerKey, {
          state: "blocked",
          location,
          proceed() {
            updateBlocker(blockerKey, {
              state: "proceeding",
              proceed: undefined,
              reset: undefined,
              location
            });
            // Re-do the same POP navigation we just blocked, after the url
            // restoration is also complete.  See:
            // https://github.com/remix-run/react-router/issues/11613
            nextHistoryUpdatePromise.then(() => init.history.go(delta));
          },
          reset() {
            let blockers = new Map(state.blockers);
            blockers.set(blockerKey, IDLE_BLOCKER);
            updateState({
              blockers
            });
          }
        });
        return;
      }
      return startNavigation(historyAction, location);
    });
    if (isBrowser) {
      // FIXME: This feels gross.  How can we cleanup the lines between
      // scrollRestoration/appliedTransitions persistance?
      restoreAppliedTransitions(routerWindow, appliedViewTransitions);
      let _saveAppliedTransitions = () => persistAppliedTransitions(routerWindow, appliedViewTransitions);
      routerWindow.addEventListener("pagehide", _saveAppliedTransitions);
      removePageHideEventListener = () => routerWindow.removeEventListener("pagehide", _saveAppliedTransitions);
    }
    // Kick off initial data load if needed.  Use Pop to avoid modifying history
    // Note we don't do any handling of lazy here.  For SPA's it'll get handled
    // in the normal navigation flow.  For SSR it's expected that lazy modules are
    // resolved prior to router creation since we can't go into a fallbackElement
    // UI for SSR'd apps
    if (!state.initialized) {
      startNavigation(Action.Pop, state.location, {
        initialHydration: true
      });
    }
    return router;
  }
  // Clean up a router and it's side effects
  function dispose() {
    if (unlistenHistory) {
      unlistenHistory();
    }
    if (removePageHideEventListener) {
      removePageHideEventListener();
    }
    subscribers.clear();
    pendingNavigationController && pendingNavigationController.abort();
    state.fetchers.forEach((_, key) => deleteFetcher(key));
    state.blockers.forEach((_, key) => deleteBlocker(key));
  }
  // Subscribe to state updates for the router
  function subscribe(fn) {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  }
  // Update our state and notify the calling context of the change
  function updateState(newState, opts) {
    if (opts === void 0) {
      opts = {};
    }
    state = _extends({}, state, newState);
    // Prep fetcher cleanup so we can tell the UI which fetcher data entries
    // can be removed
    let completedFetchers = [];
    let deletedFetchersKeys = [];
    if (future.v7_fetcherPersist) {
      state.fetchers.forEach((fetcher, key) => {
        if (fetcher.state === "idle") {
          if (deletedFetchers.has(key)) {
            // Unmounted from the UI and can be totally removed
            deletedFetchersKeys.push(key);
          } else {
            // Returned to idle but still mounted in the UI, so semi-remains for
            // revalidations and such
            completedFetchers.push(key);
          }
        }
      });
    }
    // Remove any lingering deleted fetchers that have already been removed
    // from state.fetchers
    deletedFetchers.forEach(key => {
      if (!state.fetchers.has(key) && !fetchControllers.has(key)) {
        deletedFetchersKeys.push(key);
      }
    });
    // Iterate over a local copy so that if flushSync is used and we end up
    // removing and adding a new subscriber due to the useCallback dependencies,
    // we don't get ourselves into a loop calling the new subscriber immediately
    [...subscribers].forEach(subscriber => subscriber(state, {
      deletedFetchers: deletedFetchersKeys,
      viewTransitionOpts: opts.viewTransitionOpts,
      flushSync: opts.flushSync === true
    }));
    // Remove idle fetchers from state since we only care about in-flight fetchers.
    if (future.v7_fetcherPersist) {
      completedFetchers.forEach(key => state.fetchers.delete(key));
      deletedFetchersKeys.forEach(key => deleteFetcher(key));
    } else {
      // We already called deleteFetcher() on these, can remove them from this
      // Set now that we've handed the keys off to the data layer
      deletedFetchersKeys.forEach(key => deletedFetchers.delete(key));
    }
  }
  // Complete a navigation returning the state.navigation back to the IDLE_NAVIGATION
  // and setting state.[historyAction/location/matches] to the new route.
  // - Location is a required param
  // - Navigation will always be set to IDLE_NAVIGATION
  // - Can pass any other state in newState
  function completeNavigation(location, newState, _temp) {
    var _location$state, _location$state2;
    let {
      flushSync
    } = _temp === void 0 ? {} : _temp;
    // Deduce if we're in a loading/actionReload state:
    // - We have committed actionData in the store
    // - The current navigation was a mutation submission
    // - We're past the submitting state and into the loading state
    // - The location being loaded is not the result of a redirect
    let isActionReload = state.actionData != null && state.navigation.formMethod != null && isMutationMethod(state.navigation.formMethod) && state.navigation.state === "loading" && ((_location$state = location.state) == null ? void 0 : _location$state._isRedirect) !== true;
    let actionData;
    if (newState.actionData) {
      if (Object.keys(newState.actionData).length > 0) {
        actionData = newState.actionData;
      } else {
        // Empty actionData -> clear prior actionData due to an action error
        actionData = null;
      }
    } else if (isActionReload) {
      // Keep the current data if we're wrapping up the action reload
      actionData = state.actionData;
    } else {
      // Clear actionData on any other completed navigations
      actionData = null;
    }
    // Always preserve any existing loaderData from re-used routes
    let loaderData = newState.loaderData ? mergeLoaderData(state.loaderData, newState.loaderData, newState.matches || [], newState.errors) : state.loaderData;
    // On a successful navigation we can assume we got through all blockers
    // so we can start fresh
    let blockers = state.blockers;
    if (blockers.size > 0) {
      blockers = new Map(blockers);
      blockers.forEach((_, k) => blockers.set(k, IDLE_BLOCKER));
    }
    // Always respect the user flag.  Otherwise don't reset on mutation
    // submission navigations unless they redirect
    let preventScrollReset = pendingPreventScrollReset === true || state.navigation.formMethod != null && isMutationMethod(state.navigation.formMethod) && ((_location$state2 = location.state) == null ? void 0 : _location$state2._isRedirect) !== true;
    // Commit any in-flight routes at the end of the HMR revalidation "navigation"
    if (inFlightDataRoutes) {
      dataRoutes = inFlightDataRoutes;
      inFlightDataRoutes = undefined;
    }
    if (isUninterruptedRevalidation) ; else if (pendingAction === Action.Pop) ; else if (pendingAction === Action.Push) {
      init.history.push(location, location.state);
    } else if (pendingAction === Action.Replace) {
      init.history.replace(location, location.state);
    }
    let viewTransitionOpts;
    // On POP, enable transitions if they were enabled on the original navigation
    if (pendingAction === Action.Pop) {
      // Forward takes precedence so they behave like the original navigation
      let priorPaths = appliedViewTransitions.get(state.location.pathname);
      if (priorPaths && priorPaths.has(location.pathname)) {
        viewTransitionOpts = {
          currentLocation: state.location,
          nextLocation: location
        };
      } else if (appliedViewTransitions.has(location.pathname)) {
        // If we don't have a previous forward nav, assume we're popping back to
        // the new location and enable if that location previously enabled
        viewTransitionOpts = {
          currentLocation: location,
          nextLocation: state.location
        };
      }
    } else if (pendingViewTransitionEnabled) {
      // Store the applied transition on PUSH/REPLACE
      let toPaths = appliedViewTransitions.get(state.location.pathname);
      if (toPaths) {
        toPaths.add(location.pathname);
      } else {
        toPaths = new Set([location.pathname]);
        appliedViewTransitions.set(state.location.pathname, toPaths);
      }
      viewTransitionOpts = {
        currentLocation: state.location,
        nextLocation: location
      };
    }
    updateState(_extends({}, newState, {
      actionData,
      loaderData,
      historyAction: pendingAction,
      location,
      initialized: true,
      navigation: IDLE_NAVIGATION,
      revalidation: "idle",
      restoreScrollPosition: getSavedScrollPosition(location, newState.matches || state.matches),
      preventScrollReset,
      blockers
    }), {
      viewTransitionOpts,
      flushSync: flushSync === true
    });
    // Reset stateful navigation vars
    pendingAction = Action.Pop;
    pendingPreventScrollReset = false;
    pendingViewTransitionEnabled = false;
    isUninterruptedRevalidation = false;
    isRevalidationRequired = false;
    cancelledDeferredRoutes = [];
  }
  // Trigger a navigation event, which can either be a numerical POP or a PUSH
  // replace with an optional submission
  async function navigate(to, opts) {
    if (typeof to === "number") {
      init.history.go(to);
      return;
    }
    let normalizedPath = normalizeTo(state.location, state.matches, basename, future.v7_prependBasename, to, future.v7_relativeSplatPath, opts == null ? void 0 : opts.fromRouteId, opts == null ? void 0 : opts.relative);
    let {
      path,
      submission,
      error
    } = normalizeNavigateOptions(future.v7_normalizeFormMethod, false, normalizedPath, opts);
    let currentLocation = state.location;
    let nextLocation = createLocation(state.location, path, opts && opts.state);
    // When using navigate as a PUSH/REPLACE we aren't reading an already-encoded
    // URL from window.location, so we need to encode it here so the behavior
    // remains the same as POP and non-data-router usages.  new URL() does all
    // the same encoding we'd get from a history.pushState/window.location read
    // without having to touch history
    nextLocation = _extends({}, nextLocation, init.history.encodeLocation(nextLocation));
    let userReplace = opts && opts.replace != null ? opts.replace : undefined;
    let historyAction = Action.Push;
    if (userReplace === true) {
      historyAction = Action.Replace;
    } else if (userReplace === false) ; else if (submission != null && isMutationMethod(submission.formMethod) && submission.formAction === state.location.pathname + state.location.search) {
      // By default on submissions to the current location we REPLACE so that
      // users don't have to double-click the back button to get to the prior
      // location.  If the user redirects to a different location from the
      // action/loader this will be ignored and the redirect will be a PUSH
      historyAction = Action.Replace;
    }
    let preventScrollReset = opts && "preventScrollReset" in opts ? opts.preventScrollReset === true : undefined;
    let flushSync = (opts && opts.flushSync) === true;
    let blockerKey = shouldBlockNavigation({
      currentLocation,
      nextLocation,
      historyAction
    });
    if (blockerKey) {
      // Put the blocker into a blocked state
      updateBlocker(blockerKey, {
        state: "blocked",
        location: nextLocation,
        proceed() {
          updateBlocker(blockerKey, {
            state: "proceeding",
            proceed: undefined,
            reset: undefined,
            location: nextLocation
          });
          // Send the same navigation through
          navigate(to, opts);
        },
        reset() {
          let blockers = new Map(state.blockers);
          blockers.set(blockerKey, IDLE_BLOCKER);
          updateState({
            blockers
          });
        }
      });
      return;
    }
    return await startNavigation(historyAction, nextLocation, {
      submission,
      // Send through the formData serialization error if we have one so we can
      // render at the right error boundary after we match routes
      pendingError: error,
      preventScrollReset,
      replace: opts && opts.replace,
      enableViewTransition: opts && opts.viewTransition,
      flushSync
    });
  }
  // Revalidate all current loaders.  If a navigation is in progress or if this
  // is interrupted by a navigation, allow this to "succeed" by calling all
  // loaders during the next loader round
  function revalidate() {
    interruptActiveLoads();
    updateState({
      revalidation: "loading"
    });
    // If we're currently submitting an action, we don't need to start a new
    // navigation, we'll just let the follow up loader execution call all loaders
    if (state.navigation.state === "submitting") {
      return;
    }
    // If we're currently in an idle state, start a new navigation for the current
    // action/location and mark it as uninterrupted, which will skip the history
    // update in completeNavigation
    if (state.navigation.state === "idle") {
      startNavigation(state.historyAction, state.location, {
        startUninterruptedRevalidation: true
      });
      return;
    }
    // Otherwise, if we're currently in a loading state, just start a new
    // navigation to the navigation.location but do not trigger an uninterrupted
    // revalidation so that history correctly updates once the navigation completes
    startNavigation(pendingAction || state.historyAction, state.navigation.location, {
      overrideNavigation: state.navigation,
      // Proxy through any rending view transition
      enableViewTransition: pendingViewTransitionEnabled === true
    });
  }
  // Start a navigation to the given action/location.  Can optionally provide a
  // overrideNavigation which will override the normalLoad in the case of a redirect
  // navigation
  async function startNavigation(historyAction, location, opts) {
    // Abort any in-progress navigations and start a new one. Unset any ongoing
    // uninterrupted revalidations unless told otherwise, since we want this
    // new navigation to update history normally
    pendingNavigationController && pendingNavigationController.abort();
    pendingNavigationController = null;
    pendingAction = historyAction;
    isUninterruptedRevalidation = (opts && opts.startUninterruptedRevalidation) === true;
    // Save the current scroll position every time we start a new navigation,
    // and track whether we should reset scroll on completion
    saveScrollPosition(state.location, state.matches);
    pendingPreventScrollReset = (opts && opts.preventScrollReset) === true;
    pendingViewTransitionEnabled = (opts && opts.enableViewTransition) === true;
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let loadingNavigation = opts && opts.overrideNavigation;
    let matches = opts != null && opts.initialHydration && state.matches && state.matches.length > 0 && !initialMatchesIsFOW ?
    // `matchRoutes()` has already been called if we're in here via `router.initialize()`
    state.matches : matchRoutes(routesToUse, location, basename);
    let flushSync = (opts && opts.flushSync) === true;
    // Short circuit if it's only a hash change and not a revalidation or
    // mutation submission.
    //
    // Ignore on initial page loads because since the initial hydration will always
    // be "same hash".  For example, on /page#hash and submit a <Form method="post">
    // which will default to a navigation to /page
    if (matches && state.initialized && !isRevalidationRequired && isHashChangeOnly(state.location, location) && !(opts && opts.submission && isMutationMethod(opts.submission.formMethod))) {
      completeNavigation(location, {
        matches
      }, {
        flushSync
      });
      return;
    }
    let fogOfWar = checkFogOfWar(matches, routesToUse, location.pathname);
    if (fogOfWar.active && fogOfWar.matches) {
      matches = fogOfWar.matches;
    }
    // Short circuit with a 404 on the root error boundary if we match nothing
    if (!matches) {
      let {
        error,
        notFoundMatches,
        route
      } = handleNavigational404(location.pathname);
      completeNavigation(location, {
        matches: notFoundMatches,
        loaderData: {},
        errors: {
          [route.id]: error
        }
      }, {
        flushSync
      });
      return;
    }
    // Create a controller/Request for this navigation
    pendingNavigationController = new AbortController();
    let request = createClientSideRequest(init.history, location, pendingNavigationController.signal, opts && opts.submission);
    let pendingActionResult;
    if (opts && opts.pendingError) {
      // If we have a pendingError, it means the user attempted a GET submission
      // with binary FormData so assign here and skip to handleLoaders.  That
      // way we handle calling loaders above the boundary etc.  It's not really
      // different from an actionError in that sense.
      pendingActionResult = [findNearestBoundary(matches).route.id, {
        type: ResultType.error,
        error: opts.pendingError
      }];
    } else if (opts && opts.submission && isMutationMethod(opts.submission.formMethod)) {
      // Call action if we received an action submission
      let actionResult = await handleAction(request, location, opts.submission, matches, fogOfWar.active, {
        replace: opts.replace,
        flushSync
      });
      if (actionResult.shortCircuited) {
        return;
      }
      // If we received a 404 from handleAction, it's because we couldn't lazily
      // discover the destination route so we don't want to call loaders
      if (actionResult.pendingActionResult) {
        let [routeId, result] = actionResult.pendingActionResult;
        if (isErrorResult(result) && isRouteErrorResponse(result.error) && result.error.status === 404) {
          pendingNavigationController = null;
          completeNavigation(location, {
            matches: actionResult.matches,
            loaderData: {},
            errors: {
              [routeId]: result.error
            }
          });
          return;
        }
      }
      matches = actionResult.matches || matches;
      pendingActionResult = actionResult.pendingActionResult;
      loadingNavigation = getLoadingNavigation(location, opts.submission);
      flushSync = false;
      // No need to do fog of war matching again on loader execution
      fogOfWar.active = false;
      // Create a GET request for the loaders
      request = createClientSideRequest(init.history, request.url, request.signal);
    }
    // Call loaders
    let {
      shortCircuited,
      matches: updatedMatches,
      loaderData,
      errors
    } = await handleLoaders(request, location, matches, fogOfWar.active, loadingNavigation, opts && opts.submission, opts && opts.fetcherSubmission, opts && opts.replace, opts && opts.initialHydration === true, flushSync, pendingActionResult);
    if (shortCircuited) {
      return;
    }
    // Clean up now that the action/loaders have completed.  Don't clean up if
    // we short circuited because pendingNavigationController will have already
    // been assigned to a new controller for the next navigation
    pendingNavigationController = null;
    completeNavigation(location, _extends({
      matches: updatedMatches || matches
    }, getActionDataForCommit(pendingActionResult), {
      loaderData,
      errors
    }));
  }
  // Call the action matched by the leaf route for this navigation and handle
  // redirects/errors
  async function handleAction(request, location, submission, matches, isFogOfWar, opts) {
    if (opts === void 0) {
      opts = {};
    }
    interruptActiveLoads();
    // Put us in a submitting state
    let navigation = getSubmittingNavigation(location, submission);
    updateState({
      navigation
    }, {
      flushSync: opts.flushSync === true
    });
    if (isFogOfWar) {
      let discoverResult = await discoverRoutes(matches, location.pathname, request.signal);
      if (discoverResult.type === "aborted") {
        return {
          shortCircuited: true
        };
      } else if (discoverResult.type === "error") {
        let boundaryId = findNearestBoundary(discoverResult.partialMatches).route.id;
        return {
          matches: discoverResult.partialMatches,
          pendingActionResult: [boundaryId, {
            type: ResultType.error,
            error: discoverResult.error
          }]
        };
      } else if (!discoverResult.matches) {
        let {
          notFoundMatches,
          error,
          route
        } = handleNavigational404(location.pathname);
        return {
          matches: notFoundMatches,
          pendingActionResult: [route.id, {
            type: ResultType.error,
            error
          }]
        };
      } else {
        matches = discoverResult.matches;
      }
    }
    // Call our action and get the result
    let result;
    let actionMatch = getTargetMatch(matches, location);
    if (!actionMatch.route.action && !actionMatch.route.lazy) {
      result = {
        type: ResultType.error,
        error: getInternalRouterError(405, {
          method: request.method,
          pathname: location.pathname,
          routeId: actionMatch.route.id
        })
      };
    } else {
      let results = await callDataStrategy("action", state, request, [actionMatch], matches, null);
      result = results[actionMatch.route.id];
      if (request.signal.aborted) {
        return {
          shortCircuited: true
        };
      }
    }
    if (isRedirectResult(result)) {
      let replace;
      if (opts && opts.replace != null) {
        replace = opts.replace;
      } else {
        // If the user didn't explicity indicate replace behavior, replace if
        // we redirected to the exact same location we're currently at to avoid
        // double back-buttons
        let location = normalizeRedirectLocation(result.response.headers.get("Location"), new URL(request.url), basename);
        replace = location === state.location.pathname + state.location.search;
      }
      await startRedirectNavigation(request, result, true, {
        submission,
        replace
      });
      return {
        shortCircuited: true
      };
    }
    if (isDeferredResult(result)) {
      throw getInternalRouterError(400, {
        type: "defer-action"
      });
    }
    if (isErrorResult(result)) {
      // Store off the pending error - we use it to determine which loaders
      // to call and will commit it when we complete the navigation
      let boundaryMatch = findNearestBoundary(matches, actionMatch.route.id);
      // By default, all submissions to the current location are REPLACE
      // navigations, but if the action threw an error that'll be rendered in
      // an errorElement, we fall back to PUSH so that the user can use the
      // back button to get back to the pre-submission form location to try
      // again
      if ((opts && opts.replace) !== true) {
        pendingAction = Action.Push;
      }
      return {
        matches,
        pendingActionResult: [boundaryMatch.route.id, result]
      };
    }
    return {
      matches,
      pendingActionResult: [actionMatch.route.id, result]
    };
  }
  // Call all applicable loaders for the given matches, handling redirects,
  // errors, etc.
  async function handleLoaders(request, location, matches, isFogOfWar, overrideNavigation, submission, fetcherSubmission, replace, initialHydration, flushSync, pendingActionResult) {
    // Figure out the right navigation we want to use for data loading
    let loadingNavigation = overrideNavigation || getLoadingNavigation(location, submission);
    // If this was a redirect from an action we don't have a "submission" but
    // we have it on the loading navigation so use that if available
    let activeSubmission = submission || fetcherSubmission || getSubmissionFromNavigation(loadingNavigation);
    // If this is an uninterrupted revalidation, we remain in our current idle
    // state.  If not, we need to switch to our loading state and load data,
    // preserving any new action data or existing action data (in the case of
    // a revalidation interrupting an actionReload)
    // If we have partialHydration enabled, then don't update the state for the
    // initial data load since it's not a "navigation"
    let shouldUpdateNavigationState = !isUninterruptedRevalidation && (!future.v7_partialHydration || !initialHydration);
    // When fog of war is enabled, we enter our `loading` state earlier so we
    // can discover new routes during the `loading` state.  We skip this if
    // we've already run actions since we would have done our matching already.
    // If the children() function threw then, we want to proceed with the
    // partial matches it discovered.
    if (isFogOfWar) {
      if (shouldUpdateNavigationState) {
        let actionData = getUpdatedActionData(pendingActionResult);
        updateState(_extends({
          navigation: loadingNavigation
        }, actionData !== undefined ? {
          actionData
        } : {}), {
          flushSync
        });
      }
      let discoverResult = await discoverRoutes(matches, location.pathname, request.signal);
      if (discoverResult.type === "aborted") {
        return {
          shortCircuited: true
        };
      } else if (discoverResult.type === "error") {
        let boundaryId = findNearestBoundary(discoverResult.partialMatches).route.id;
        return {
          matches: discoverResult.partialMatches,
          loaderData: {},
          errors: {
            [boundaryId]: discoverResult.error
          }
        };
      } else if (!discoverResult.matches) {
        let {
          error,
          notFoundMatches,
          route
        } = handleNavigational404(location.pathname);
        return {
          matches: notFoundMatches,
          loaderData: {},
          errors: {
            [route.id]: error
          }
        };
      } else {
        matches = discoverResult.matches;
      }
    }
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let [matchesToLoad, revalidatingFetchers] = getMatchesToLoad(init.history, state, matches, activeSubmission, location, future.v7_partialHydration && initialHydration === true, future.v7_skipActionErrorRevalidation, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, deletedFetchers, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, pendingActionResult);
    // Cancel pending deferreds for no-longer-matched routes or routes we're
    // about to reload.  Note that if this is an action reload we would have
    // already cancelled all pending deferreds so this would be a no-op
    cancelActiveDeferreds(routeId => !(matches && matches.some(m => m.route.id === routeId)) || matchesToLoad && matchesToLoad.some(m => m.route.id === routeId));
    pendingNavigationLoadId = ++incrementingLoadId;
    // Short circuit if we have no loaders to run
    if (matchesToLoad.length === 0 && revalidatingFetchers.length === 0) {
      let updatedFetchers = markFetchRedirectsDone();
      completeNavigation(location, _extends({
        matches,
        loaderData: {},
        // Commit pending error if we're short circuiting
        errors: pendingActionResult && isErrorResult(pendingActionResult[1]) ? {
          [pendingActionResult[0]]: pendingActionResult[1].error
        } : null
      }, getActionDataForCommit(pendingActionResult), updatedFetchers ? {
        fetchers: new Map(state.fetchers)
      } : {}), {
        flushSync
      });
      return {
        shortCircuited: true
      };
    }
    if (shouldUpdateNavigationState) {
      let updates = {};
      if (!isFogOfWar) {
        // Only update navigation/actionNData if we didn't already do it above
        updates.navigation = loadingNavigation;
        let actionData = getUpdatedActionData(pendingActionResult);
        if (actionData !== undefined) {
          updates.actionData = actionData;
        }
      }
      if (revalidatingFetchers.length > 0) {
        updates.fetchers = getUpdatedRevalidatingFetchers(revalidatingFetchers);
      }
      updateState(updates, {
        flushSync
      });
    }
    revalidatingFetchers.forEach(rf => {
      abortFetcher(rf.key);
      if (rf.controller) {
        // Fetchers use an independent AbortController so that aborting a fetcher
        // (via deleteFetcher) does not abort the triggering navigation that
        // triggered the revalidation
        fetchControllers.set(rf.key, rf.controller);
      }
    });
    // Proxy navigation abort through to revalidation fetchers
    let abortPendingFetchRevalidations = () => revalidatingFetchers.forEach(f => abortFetcher(f.key));
    if (pendingNavigationController) {
      pendingNavigationController.signal.addEventListener("abort", abortPendingFetchRevalidations);
    }
    let {
      loaderResults,
      fetcherResults
    } = await callLoadersAndMaybeResolveData(state, matches, matchesToLoad, revalidatingFetchers, request);
    if (request.signal.aborted) {
      return {
        shortCircuited: true
      };
    }
    // Clean up _after_ loaders have completed.  Don't clean up if we short
    // circuited because fetchControllers would have been aborted and
    // reassigned to new controllers for the next navigation
    if (pendingNavigationController) {
      pendingNavigationController.signal.removeEventListener("abort", abortPendingFetchRevalidations);
    }
    revalidatingFetchers.forEach(rf => fetchControllers.delete(rf.key));
    // If any loaders returned a redirect Response, start a new REPLACE navigation
    let redirect = findRedirect(loaderResults);
    if (redirect) {
      await startRedirectNavigation(request, redirect.result, true, {
        replace
      });
      return {
        shortCircuited: true
      };
    }
    redirect = findRedirect(fetcherResults);
    if (redirect) {
      // If this redirect came from a fetcher make sure we mark it in
      // fetchRedirectIds so it doesn't get revalidated on the next set of
      // loader executions
      fetchRedirectIds.add(redirect.key);
      await startRedirectNavigation(request, redirect.result, true, {
        replace
      });
      return {
        shortCircuited: true
      };
    }
    // Process and commit output from loaders
    let {
      loaderData,
      errors
    } = processLoaderData(state, matches, loaderResults, pendingActionResult, revalidatingFetchers, fetcherResults, activeDeferreds);
    // Wire up subscribers to update loaderData as promises settle
    activeDeferreds.forEach((deferredData, routeId) => {
      deferredData.subscribe(aborted => {
        // Note: No need to updateState here since the TrackedPromise on
        // loaderData is stable across resolve/reject
        // Remove this instance if we were aborted or if promises have settled
        if (aborted || deferredData.done) {
          activeDeferreds.delete(routeId);
        }
      });
    });
    // Preserve SSR errors during partial hydration
    if (future.v7_partialHydration && initialHydration && state.errors) {
      errors = _extends({}, state.errors, errors);
    }
    let updatedFetchers = markFetchRedirectsDone();
    let didAbortFetchLoads = abortStaleFetchLoads(pendingNavigationLoadId);
    let shouldUpdateFetchers = updatedFetchers || didAbortFetchLoads || revalidatingFetchers.length > 0;
    return _extends({
      matches,
      loaderData,
      errors
    }, shouldUpdateFetchers ? {
      fetchers: new Map(state.fetchers)
    } : {});
  }
  function getUpdatedActionData(pendingActionResult) {
    if (pendingActionResult && !isErrorResult(pendingActionResult[1])) {
      // This is cast to `any` currently because `RouteData`uses any and it
      // would be a breaking change to use any.
      // TODO: v7 - change `RouteData` to use `unknown` instead of `any`
      return {
        [pendingActionResult[0]]: pendingActionResult[1].data
      };
    } else if (state.actionData) {
      if (Object.keys(state.actionData).length === 0) {
        return null;
      } else {
        return state.actionData;
      }
    }
  }
  function getUpdatedRevalidatingFetchers(revalidatingFetchers) {
    revalidatingFetchers.forEach(rf => {
      let fetcher = state.fetchers.get(rf.key);
      let revalidatingFetcher = getLoadingFetcher(undefined, fetcher ? fetcher.data : undefined);
      state.fetchers.set(rf.key, revalidatingFetcher);
    });
    return new Map(state.fetchers);
  }
  // Trigger a fetcher load/submit for the given fetcher key
  function fetch(key, routeId, href, opts) {
    if (isServer) {
      throw new Error("router.fetch() was called during the server render, but it shouldn't be. " + "You are likely calling a useFetcher() method in the body of your component. " + "Try moving it to a useEffect or a callback.");
    }
    abortFetcher(key);
    let flushSync = (opts && opts.flushSync) === true;
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let normalizedPath = normalizeTo(state.location, state.matches, basename, future.v7_prependBasename, href, future.v7_relativeSplatPath, routeId, opts == null ? void 0 : opts.relative);
    let matches = matchRoutes(routesToUse, normalizedPath, basename);
    let fogOfWar = checkFogOfWar(matches, routesToUse, normalizedPath);
    if (fogOfWar.active && fogOfWar.matches) {
      matches = fogOfWar.matches;
    }
    if (!matches) {
      setFetcherError(key, routeId, getInternalRouterError(404, {
        pathname: normalizedPath
      }), {
        flushSync
      });
      return;
    }
    let {
      path,
      submission,
      error
    } = normalizeNavigateOptions(future.v7_normalizeFormMethod, true, normalizedPath, opts);
    if (error) {
      setFetcherError(key, routeId, error, {
        flushSync
      });
      return;
    }
    let match = getTargetMatch(matches, path);
    let preventScrollReset = (opts && opts.preventScrollReset) === true;
    if (submission && isMutationMethod(submission.formMethod)) {
      handleFetcherAction(key, routeId, path, match, matches, fogOfWar.active, flushSync, preventScrollReset, submission);
      return;
    }
    // Store off the match so we can call it's shouldRevalidate on subsequent
    // revalidations
    fetchLoadMatches.set(key, {
      routeId,
      path
    });
    handleFetcherLoader(key, routeId, path, match, matches, fogOfWar.active, flushSync, preventScrollReset, submission);
  }
  // Call the action for the matched fetcher.submit(), and then handle redirects,
  // errors, and revalidation
  async function handleFetcherAction(key, routeId, path, match, requestMatches, isFogOfWar, flushSync, preventScrollReset, submission) {
    interruptActiveLoads();
    fetchLoadMatches.delete(key);
    function detectAndHandle405Error(m) {
      if (!m.route.action && !m.route.lazy) {
        let error = getInternalRouterError(405, {
          method: submission.formMethod,
          pathname: path,
          routeId: routeId
        });
        setFetcherError(key, routeId, error, {
          flushSync
        });
        return true;
      }
      return false;
    }
    if (!isFogOfWar && detectAndHandle405Error(match)) {
      return;
    }
    // Put this fetcher into it's submitting state
    let existingFetcher = state.fetchers.get(key);
    updateFetcherState(key, getSubmittingFetcher(submission, existingFetcher), {
      flushSync
    });
    let abortController = new AbortController();
    let fetchRequest = createClientSideRequest(init.history, path, abortController.signal, submission);
    if (isFogOfWar) {
      let discoverResult = await discoverRoutes(requestMatches, new URL(fetchRequest.url).pathname, fetchRequest.signal, key);
      if (discoverResult.type === "aborted") {
        return;
      } else if (discoverResult.type === "error") {
        setFetcherError(key, routeId, discoverResult.error, {
          flushSync
        });
        return;
      } else if (!discoverResult.matches) {
        setFetcherError(key, routeId, getInternalRouterError(404, {
          pathname: path
        }), {
          flushSync
        });
        return;
      } else {
        requestMatches = discoverResult.matches;
        match = getTargetMatch(requestMatches, path);
        if (detectAndHandle405Error(match)) {
          return;
        }
      }
    }
    // Call the action for the fetcher
    fetchControllers.set(key, abortController);
    let originatingLoadId = incrementingLoadId;
    let actionResults = await callDataStrategy("action", state, fetchRequest, [match], requestMatches, key);
    let actionResult = actionResults[match.route.id];
    if (fetchRequest.signal.aborted) {
      // We can delete this so long as we weren't aborted by our own fetcher
      // re-submit which would have put _new_ controller is in fetchControllers
      if (fetchControllers.get(key) === abortController) {
        fetchControllers.delete(key);
      }
      return;
    }
    // When using v7_fetcherPersist, we don't want errors bubbling up to the UI
    // or redirects processed for unmounted fetchers so we just revert them to
    // idle
    if (future.v7_fetcherPersist && deletedFetchers.has(key)) {
      if (isRedirectResult(actionResult) || isErrorResult(actionResult)) {
        updateFetcherState(key, getDoneFetcher(undefined));
        return;
      }
      // Let SuccessResult's fall through for revalidation
    } else {
      if (isRedirectResult(actionResult)) {
        fetchControllers.delete(key);
        if (pendingNavigationLoadId > originatingLoadId) {
          // A new navigation was kicked off after our action started, so that
          // should take precedence over this redirect navigation.  We already
          // set isRevalidationRequired so all loaders for the new route should
          // fire unless opted out via shouldRevalidate
          updateFetcherState(key, getDoneFetcher(undefined));
          return;
        } else {
          fetchRedirectIds.add(key);
          updateFetcherState(key, getLoadingFetcher(submission));
          return startRedirectNavigation(fetchRequest, actionResult, false, {
            fetcherSubmission: submission,
            preventScrollReset
          });
        }
      }
      // Process any non-redirect errors thrown
      if (isErrorResult(actionResult)) {
        setFetcherError(key, routeId, actionResult.error);
        return;
      }
    }
    if (isDeferredResult(actionResult)) {
      throw getInternalRouterError(400, {
        type: "defer-action"
      });
    }
    // Start the data load for current matches, or the next location if we're
    // in the middle of a navigation
    let nextLocation = state.navigation.location || state.location;
    let revalidationRequest = createClientSideRequest(init.history, nextLocation, abortController.signal);
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let matches = state.navigation.state !== "idle" ? matchRoutes(routesToUse, state.navigation.location, basename) : state.matches;
    invariant(matches, "Didn't find any matches after fetcher action");
    let loadId = ++incrementingLoadId;
    fetchReloadIds.set(key, loadId);
    let loadFetcher = getLoadingFetcher(submission, actionResult.data);
    state.fetchers.set(key, loadFetcher);
    let [matchesToLoad, revalidatingFetchers] = getMatchesToLoad(init.history, state, matches, submission, nextLocation, false, future.v7_skipActionErrorRevalidation, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, deletedFetchers, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, [match.route.id, actionResult]);
    // Put all revalidating fetchers into the loading state, except for the
    // current fetcher which we want to keep in it's current loading state which
    // contains it's action submission info + action data
    revalidatingFetchers.filter(rf => rf.key !== key).forEach(rf => {
      let staleKey = rf.key;
      let existingFetcher = state.fetchers.get(staleKey);
      let revalidatingFetcher = getLoadingFetcher(undefined, existingFetcher ? existingFetcher.data : undefined);
      state.fetchers.set(staleKey, revalidatingFetcher);
      abortFetcher(staleKey);
      if (rf.controller) {
        fetchControllers.set(staleKey, rf.controller);
      }
    });
    updateState({
      fetchers: new Map(state.fetchers)
    });
    let abortPendingFetchRevalidations = () => revalidatingFetchers.forEach(rf => abortFetcher(rf.key));
    abortController.signal.addEventListener("abort", abortPendingFetchRevalidations);
    let {
      loaderResults,
      fetcherResults
    } = await callLoadersAndMaybeResolveData(state, matches, matchesToLoad, revalidatingFetchers, revalidationRequest);
    if (abortController.signal.aborted) {
      return;
    }
    abortController.signal.removeEventListener("abort", abortPendingFetchRevalidations);
    fetchReloadIds.delete(key);
    fetchControllers.delete(key);
    revalidatingFetchers.forEach(r => fetchControllers.delete(r.key));
    let redirect = findRedirect(loaderResults);
    if (redirect) {
      return startRedirectNavigation(revalidationRequest, redirect.result, false, {
        preventScrollReset
      });
    }
    redirect = findRedirect(fetcherResults);
    if (redirect) {
      // If this redirect came from a fetcher make sure we mark it in
      // fetchRedirectIds so it doesn't get revalidated on the next set of
      // loader executions
      fetchRedirectIds.add(redirect.key);
      return startRedirectNavigation(revalidationRequest, redirect.result, false, {
        preventScrollReset
      });
    }
    // Process and commit output from loaders
    let {
      loaderData,
      errors
    } = processLoaderData(state, matches, loaderResults, undefined, revalidatingFetchers, fetcherResults, activeDeferreds);
    // Since we let revalidations complete even if the submitting fetcher was
    // deleted, only put it back to idle if it hasn't been deleted
    if (state.fetchers.has(key)) {
      let doneFetcher = getDoneFetcher(actionResult.data);
      state.fetchers.set(key, doneFetcher);
    }
    abortStaleFetchLoads(loadId);
    // If we are currently in a navigation loading state and this fetcher is
    // more recent than the navigation, we want the newer data so abort the
    // navigation and complete it with the fetcher data
    if (state.navigation.state === "loading" && loadId > pendingNavigationLoadId) {
      invariant(pendingAction, "Expected pending action");
      pendingNavigationController && pendingNavigationController.abort();
      completeNavigation(state.navigation.location, {
        matches,
        loaderData,
        errors,
        fetchers: new Map(state.fetchers)
      });
    } else {
      // otherwise just update with the fetcher data, preserving any existing
      // loaderData for loaders that did not need to reload.  We have to
      // manually merge here since we aren't going through completeNavigation
      updateState({
        errors,
        loaderData: mergeLoaderData(state.loaderData, loaderData, matches, errors),
        fetchers: new Map(state.fetchers)
      });
      isRevalidationRequired = false;
    }
  }
  // Call the matched loader for fetcher.load(), handling redirects, errors, etc.
  async function handleFetcherLoader(key, routeId, path, match, matches, isFogOfWar, flushSync, preventScrollReset, submission) {
    let existingFetcher = state.fetchers.get(key);
    updateFetcherState(key, getLoadingFetcher(submission, existingFetcher ? existingFetcher.data : undefined), {
      flushSync
    });
    let abortController = new AbortController();
    let fetchRequest = createClientSideRequest(init.history, path, abortController.signal);
    if (isFogOfWar) {
      let discoverResult = await discoverRoutes(matches, new URL(fetchRequest.url).pathname, fetchRequest.signal, key);
      if (discoverResult.type === "aborted") {
        return;
      } else if (discoverResult.type === "error") {
        setFetcherError(key, routeId, discoverResult.error, {
          flushSync
        });
        return;
      } else if (!discoverResult.matches) {
        setFetcherError(key, routeId, getInternalRouterError(404, {
          pathname: path
        }), {
          flushSync
        });
        return;
      } else {
        matches = discoverResult.matches;
        match = getTargetMatch(matches, path);
      }
    }
    // Call the loader for this fetcher route match
    fetchControllers.set(key, abortController);
    let originatingLoadId = incrementingLoadId;
    let results = await callDataStrategy("loader", state, fetchRequest, [match], matches, key);
    let result = results[match.route.id];
    // Deferred isn't supported for fetcher loads, await everything and treat it
    // as a normal load.  resolveDeferredData will return undefined if this
    // fetcher gets aborted, so we just leave result untouched and short circuit
    // below if that happens
    if (isDeferredResult(result)) {
      result = (await resolveDeferredData(result, fetchRequest.signal, true)) || result;
    }
    // We can delete this so long as we weren't aborted by our our own fetcher
    // re-load which would have put _new_ controller is in fetchControllers
    if (fetchControllers.get(key) === abortController) {
      fetchControllers.delete(key);
    }
    if (fetchRequest.signal.aborted) {
      return;
    }
    // We don't want errors bubbling up or redirects followed for unmounted
    // fetchers, so short circuit here if it was removed from the UI
    if (deletedFetchers.has(key)) {
      updateFetcherState(key, getDoneFetcher(undefined));
      return;
    }
    // If the loader threw a redirect Response, start a new REPLACE navigation
    if (isRedirectResult(result)) {
      if (pendingNavigationLoadId > originatingLoadId) {
        // A new navigation was kicked off after our loader started, so that
        // should take precedence over this redirect navigation
        updateFetcherState(key, getDoneFetcher(undefined));
        return;
      } else {
        fetchRedirectIds.add(key);
        await startRedirectNavigation(fetchRequest, result, false, {
          preventScrollReset
        });
        return;
      }
    }
    // Process any non-redirect errors thrown
    if (isErrorResult(result)) {
      setFetcherError(key, routeId, result.error);
      return;
    }
    invariant(!isDeferredResult(result), "Unhandled fetcher deferred data");
    // Put the fetcher back into an idle state
    updateFetcherState(key, getDoneFetcher(result.data));
  }
  /**
   * Utility function to handle redirects returned from an action or loader.
   * Normally, a redirect "replaces" the navigation that triggered it.  So, for
   * example:
   *
   *  - user is on /a
   *  - user clicks a link to /b
   *  - loader for /b redirects to /c
   *
   * In a non-JS app the browser would track the in-flight navigation to /b and
   * then replace it with /c when it encountered the redirect response.  In
   * the end it would only ever update the URL bar with /c.
   *
   * In client-side routing using pushState/replaceState, we aim to emulate
   * this behavior and we also do not update history until the end of the
   * navigation (including processed redirects).  This means that we never
   * actually touch history until we've processed redirects, so we just use
   * the history action from the original navigation (PUSH or REPLACE).
   */
  async function startRedirectNavigation(request, redirect, isNavigation, _temp2) {
    let {
      submission,
      fetcherSubmission,
      preventScrollReset,
      replace
    } = _temp2 === void 0 ? {} : _temp2;
    if (redirect.response.headers.has("X-Remix-Revalidate")) {
      isRevalidationRequired = true;
    }
    let location = redirect.response.headers.get("Location");
    invariant(location, "Expected a Location header on the redirect Response");
    location = normalizeRedirectLocation(location, new URL(request.url), basename);
    let redirectLocation = createLocation(state.location, location, {
      _isRedirect: true
    });
    if (isBrowser) {
      let isDocumentReload = false;
      if (redirect.response.headers.has("X-Remix-Reload-Document")) {
        // Hard reload if the response contained X-Remix-Reload-Document
        isDocumentReload = true;
      } else if (ABSOLUTE_URL_REGEX.test(location)) {
        const url = init.history.createURL(location);
        isDocumentReload =
        // Hard reload if it's an absolute URL to a new origin
        url.origin !== routerWindow.location.origin ||
        // Hard reload if it's an absolute URL that does not match our basename
        stripBasename(url.pathname, basename) == null;
      }
      if (isDocumentReload) {
        if (replace) {
          routerWindow.location.replace(location);
        } else {
          routerWindow.location.assign(location);
        }
        return;
      }
    }
    // There's no need to abort on redirects, since we don't detect the
    // redirect until the action/loaders have settled
    pendingNavigationController = null;
    let redirectHistoryAction = replace === true || redirect.response.headers.has("X-Remix-Replace") ? Action.Replace : Action.Push;
    // Use the incoming submission if provided, fallback on the active one in
    // state.navigation
    let {
      formMethod,
      formAction,
      formEncType
    } = state.navigation;
    if (!submission && !fetcherSubmission && formMethod && formAction && formEncType) {
      submission = getSubmissionFromNavigation(state.navigation);
    }
    // If this was a 307/308 submission we want to preserve the HTTP method and
    // re-submit the GET/POST/PUT/PATCH/DELETE as a submission navigation to the
    // redirected location
    let activeSubmission = submission || fetcherSubmission;
    if (redirectPreserveMethodStatusCodes.has(redirect.response.status) && activeSubmission && isMutationMethod(activeSubmission.formMethod)) {
      await startNavigation(redirectHistoryAction, redirectLocation, {
        submission: _extends({}, activeSubmission, {
          formAction: location
        }),
        // Preserve these flags across redirects
        preventScrollReset: preventScrollReset || pendingPreventScrollReset,
        enableViewTransition: isNavigation ? pendingViewTransitionEnabled : undefined
      });
    } else {
      // If we have a navigation submission, we will preserve it through the
      // redirect navigation
      let overrideNavigation = getLoadingNavigation(redirectLocation, submission);
      await startNavigation(redirectHistoryAction, redirectLocation, {
        overrideNavigation,
        // Send fetcher submissions through for shouldRevalidate
        fetcherSubmission,
        // Preserve these flags across redirects
        preventScrollReset: preventScrollReset || pendingPreventScrollReset,
        enableViewTransition: isNavigation ? pendingViewTransitionEnabled : undefined
      });
    }
  }
  // Utility wrapper for calling dataStrategy client-side without having to
  // pass around the manifest, mapRouteProperties, etc.
  async function callDataStrategy(type, state, request, matchesToLoad, matches, fetcherKey) {
    let results;
    let dataResults = {};
    try {
      results = await callDataStrategyImpl(dataStrategyImpl, type, state, request, matchesToLoad, matches, fetcherKey, manifest, mapRouteProperties);
    } catch (e) {
      // If the outer dataStrategy method throws, just return the error for all
      // matches - and it'll naturally bubble to the root
      matchesToLoad.forEach(m => {
        dataResults[m.route.id] = {
          type: ResultType.error,
          error: e
        };
      });
      return dataResults;
    }
    for (let [routeId, result] of Object.entries(results)) {
      if (isRedirectDataStrategyResultResult(result)) {
        let response = result.result;
        dataResults[routeId] = {
          type: ResultType.redirect,
          response: normalizeRelativeRoutingRedirectResponse(response, request, routeId, matches, basename, future.v7_relativeSplatPath)
        };
      } else {
        dataResults[routeId] = await convertDataStrategyResultToDataResult(result);
      }
    }
    return dataResults;
  }
  async function callLoadersAndMaybeResolveData(state, matches, matchesToLoad, fetchersToLoad, request) {
    let currentMatches = state.matches;
    // Kick off loaders and fetchers in parallel
    let loaderResultsPromise = callDataStrategy("loader", state, request, matchesToLoad, matches, null);
    let fetcherResultsPromise = Promise.all(fetchersToLoad.map(async f => {
      if (f.matches && f.match && f.controller) {
        let results = await callDataStrategy("loader", state, createClientSideRequest(init.history, f.path, f.controller.signal), [f.match], f.matches, f.key);
        let result = results[f.match.route.id];
        // Fetcher results are keyed by fetcher key from here on out, not routeId
        return {
          [f.key]: result
        };
      } else {
        return Promise.resolve({
          [f.key]: {
            type: ResultType.error,
            error: getInternalRouterError(404, {
              pathname: f.path
            })
          }
        });
      }
    }));
    let loaderResults = await loaderResultsPromise;
    let fetcherResults = (await fetcherResultsPromise).reduce((acc, r) => Object.assign(acc, r), {});
    await Promise.all([resolveNavigationDeferredResults(matches, loaderResults, request.signal, currentMatches, state.loaderData), resolveFetcherDeferredResults(matches, fetcherResults, fetchersToLoad)]);
    return {
      loaderResults,
      fetcherResults
    };
  }
  function interruptActiveLoads() {
    // Every interruption triggers a revalidation
    isRevalidationRequired = true;
    // Cancel pending route-level deferreds and mark cancelled routes for
    // revalidation
    cancelledDeferredRoutes.push(...cancelActiveDeferreds());
    // Abort in-flight fetcher loads
    fetchLoadMatches.forEach((_, key) => {
      if (fetchControllers.has(key)) {
        cancelledFetcherLoads.add(key);
      }
      abortFetcher(key);
    });
  }
  function updateFetcherState(key, fetcher, opts) {
    if (opts === void 0) {
      opts = {};
    }
    state.fetchers.set(key, fetcher);
    updateState({
      fetchers: new Map(state.fetchers)
    }, {
      flushSync: (opts && opts.flushSync) === true
    });
  }
  function setFetcherError(key, routeId, error, opts) {
    if (opts === void 0) {
      opts = {};
    }
    let boundaryMatch = findNearestBoundary(state.matches, routeId);
    deleteFetcher(key);
    updateState({
      errors: {
        [boundaryMatch.route.id]: error
      },
      fetchers: new Map(state.fetchers)
    }, {
      flushSync: (opts && opts.flushSync) === true
    });
  }
  function getFetcher(key) {
    activeFetchers.set(key, (activeFetchers.get(key) || 0) + 1);
    // If this fetcher was previously marked for deletion, unmark it since we
    // have a new instance
    if (deletedFetchers.has(key)) {
      deletedFetchers.delete(key);
    }
    return state.fetchers.get(key) || IDLE_FETCHER;
  }
  function deleteFetcher(key) {
    let fetcher = state.fetchers.get(key);
    // Don't abort the controller if this is a deletion of a fetcher.submit()
    // in it's loading phase since - we don't want to abort the corresponding
    // revalidation and want them to complete and land
    if (fetchControllers.has(key) && !(fetcher && fetcher.state === "loading" && fetchReloadIds.has(key))) {
      abortFetcher(key);
    }
    fetchLoadMatches.delete(key);
    fetchReloadIds.delete(key);
    fetchRedirectIds.delete(key);
    // If we opted into the flag we can clear this now since we're calling
    // deleteFetcher() at the end of updateState() and we've already handed the
    // deleted fetcher keys off to the data layer.
    // If not, we're eagerly calling deleteFetcher() and we need to keep this
    // Set populated until the next updateState call, and we'll clear
    // `deletedFetchers` then
    if (future.v7_fetcherPersist) {
      deletedFetchers.delete(key);
    }
    cancelledFetcherLoads.delete(key);
    state.fetchers.delete(key);
  }
  function deleteFetcherAndUpdateState(key) {
    let count = (activeFetchers.get(key) || 0) - 1;
    if (count <= 0) {
      activeFetchers.delete(key);
      deletedFetchers.add(key);
      if (!future.v7_fetcherPersist) {
        deleteFetcher(key);
      }
    } else {
      activeFetchers.set(key, count);
    }
    updateState({
      fetchers: new Map(state.fetchers)
    });
  }
  function abortFetcher(key) {
    let controller = fetchControllers.get(key);
    if (controller) {
      controller.abort();
      fetchControllers.delete(key);
    }
  }
  function markFetchersDone(keys) {
    for (let key of keys) {
      let fetcher = getFetcher(key);
      let doneFetcher = getDoneFetcher(fetcher.data);
      state.fetchers.set(key, doneFetcher);
    }
  }
  function markFetchRedirectsDone() {
    let doneKeys = [];
    let updatedFetchers = false;
    for (let key of fetchRedirectIds) {
      let fetcher = state.fetchers.get(key);
      invariant(fetcher, "Expected fetcher: " + key);
      if (fetcher.state === "loading") {
        fetchRedirectIds.delete(key);
        doneKeys.push(key);
        updatedFetchers = true;
      }
    }
    markFetchersDone(doneKeys);
    return updatedFetchers;
  }
  function abortStaleFetchLoads(landedId) {
    let yeetedKeys = [];
    for (let [key, id] of fetchReloadIds) {
      if (id < landedId) {
        let fetcher = state.fetchers.get(key);
        invariant(fetcher, "Expected fetcher: " + key);
        if (fetcher.state === "loading") {
          abortFetcher(key);
          fetchReloadIds.delete(key);
          yeetedKeys.push(key);
        }
      }
    }
    markFetchersDone(yeetedKeys);
    return yeetedKeys.length > 0;
  }
  function getBlocker(key, fn) {
    let blocker = state.blockers.get(key) || IDLE_BLOCKER;
    if (blockerFunctions.get(key) !== fn) {
      blockerFunctions.set(key, fn);
    }
    return blocker;
  }
  function deleteBlocker(key) {
    state.blockers.delete(key);
    blockerFunctions.delete(key);
  }
  // Utility function to update blockers, ensuring valid state transitions
  function updateBlocker(key, newBlocker) {
    let blocker = state.blockers.get(key) || IDLE_BLOCKER;
    // Poor mans state machine :)
    // https://mermaid.live/edit#pako:eNqVkc9OwzAMxl8l8nnjAYrEtDIOHEBIgwvKJTReGy3_lDpIqO27k6awMG0XcrLlnz87nwdonESogKXXBuE79rq75XZO3-yHds0RJVuv70YrPlUrCEe2HfrORS3rubqZfuhtpg5C9wk5tZ4VKcRUq88q9Z8RS0-48cE1iHJkL0ugbHuFLus9L6spZy8nX9MP2CNdomVaposqu3fGayT8T8-jJQwhepo_UtpgBQaDEUom04dZhAN1aJBDlUKJBxE1ceB2Smj0Mln-IBW5AFU2dwUiktt_2Qaq2dBfaKdEup85UV7Yd-dKjlnkabl2Pvr0DTkTreM
    invariant(blocker.state === "unblocked" && newBlocker.state === "blocked" || blocker.state === "blocked" && newBlocker.state === "blocked" || blocker.state === "blocked" && newBlocker.state === "proceeding" || blocker.state === "blocked" && newBlocker.state === "unblocked" || blocker.state === "proceeding" && newBlocker.state === "unblocked", "Invalid blocker state transition: " + blocker.state + " -> " + newBlocker.state);
    let blockers = new Map(state.blockers);
    blockers.set(key, newBlocker);
    updateState({
      blockers
    });
  }
  function shouldBlockNavigation(_ref2) {
    let {
      currentLocation,
      nextLocation,
      historyAction
    } = _ref2;
    if (blockerFunctions.size === 0) {
      return;
    }
    // We ony support a single active blocker at the moment since we don't have
    // any compelling use cases for multi-blocker yet
    if (blockerFunctions.size > 1) {
      warning(false, "A router only supports one blocker at a time");
    }
    let entries = Array.from(blockerFunctions.entries());
    let [blockerKey, blockerFunction] = entries[entries.length - 1];
    let blocker = state.blockers.get(blockerKey);
    if (blocker && blocker.state === "proceeding") {
      // If the blocker is currently proceeding, we don't need to re-check
      // it and can let this navigation continue
      return;
    }
    // At this point, we know we're unblocked/blocked so we need to check the
    // user-provided blocker function
    if (blockerFunction({
      currentLocation,
      nextLocation,
      historyAction
    })) {
      return blockerKey;
    }
  }
  function handleNavigational404(pathname) {
    let error = getInternalRouterError(404, {
      pathname
    });
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let {
      matches,
      route
    } = getShortCircuitMatches(routesToUse);
    // Cancel all pending deferred on 404s since we don't keep any routes
    cancelActiveDeferreds();
    return {
      notFoundMatches: matches,
      route,
      error
    };
  }
  function cancelActiveDeferreds(predicate) {
    let cancelledRouteIds = [];
    activeDeferreds.forEach((dfd, routeId) => {
      if (!predicate || predicate(routeId)) {
        // Cancel the deferred - but do not remove from activeDeferreds here -
        // we rely on the subscribers to do that so our tests can assert proper
        // cleanup via _internalActiveDeferreds
        dfd.cancel();
        cancelledRouteIds.push(routeId);
        activeDeferreds.delete(routeId);
      }
    });
    return cancelledRouteIds;
  }
  // Opt in to capturing and reporting scroll positions during navigations,
  // used by the <ScrollRestoration> component
  function enableScrollRestoration(positions, getPosition, getKey) {
    savedScrollPositions = positions;
    getScrollPosition = getPosition;
    getScrollRestorationKey = getKey || null;
    // Perform initial hydration scroll restoration, since we miss the boat on
    // the initial updateState() because we've not yet rendered <ScrollRestoration/>
    // and therefore have no savedScrollPositions available
    if (!initialScrollRestored && state.navigation === IDLE_NAVIGATION) {
      initialScrollRestored = true;
      let y = getSavedScrollPosition(state.location, state.matches);
      if (y != null) {
        updateState({
          restoreScrollPosition: y
        });
      }
    }
    return () => {
      savedScrollPositions = null;
      getScrollPosition = null;
      getScrollRestorationKey = null;
    };
  }
  function getScrollKey(location, matches) {
    if (getScrollRestorationKey) {
      let key = getScrollRestorationKey(location, matches.map(m => convertRouteMatchToUiMatch(m, state.loaderData)));
      return key || location.key;
    }
    return location.key;
  }
  function saveScrollPosition(location, matches) {
    if (savedScrollPositions && getScrollPosition) {
      let key = getScrollKey(location, matches);
      savedScrollPositions[key] = getScrollPosition();
    }
  }
  function getSavedScrollPosition(location, matches) {
    if (savedScrollPositions) {
      let key = getScrollKey(location, matches);
      let y = savedScrollPositions[key];
      if (typeof y === "number") {
        return y;
      }
    }
    return null;
  }
  function checkFogOfWar(matches, routesToUse, pathname) {
    if (patchRoutesOnNavigationImpl) {
      if (!matches) {
        let fogMatches = matchRoutesImpl(routesToUse, pathname, basename, true);
        return {
          active: true,
          matches: fogMatches || []
        };
      } else {
        if (Object.keys(matches[0].params).length > 0) {
          // If we matched a dynamic param or a splat, it might only be because
          // we haven't yet discovered other routes that would match with a
          // higher score.  Call patchRoutesOnNavigation just to be sure
          let partialMatches = matchRoutesImpl(routesToUse, pathname, basename, true);
          return {
            active: true,
            matches: partialMatches
          };
        }
      }
    }
    return {
      active: false,
      matches: null
    };
  }
  async function discoverRoutes(matches, pathname, signal, fetcherKey) {
    if (!patchRoutesOnNavigationImpl) {
      return {
        type: "success",
        matches
      };
    }
    let partialMatches = matches;
    while (true) {
      let isNonHMR = inFlightDataRoutes == null;
      let routesToUse = inFlightDataRoutes || dataRoutes;
      let localManifest = manifest;
      try {
        await patchRoutesOnNavigationImpl({
          signal,
          path: pathname,
          matches: partialMatches,
          fetcherKey,
          patch: (routeId, children) => {
            if (signal.aborted) return;
            patchRoutesImpl(routeId, children, routesToUse, localManifest, mapRouteProperties);
          }
        });
      } catch (e) {
        return {
          type: "error",
          error: e,
          partialMatches
        };
      } finally {
        // If we are not in the middle of an HMR revalidation and we changed the
        // routes, provide a new identity so when we `updateState` at the end of
        // this navigation/fetch `router.routes` will be a new identity and
        // trigger a re-run of memoized `router.routes` dependencies.
        // HMR will already update the identity and reflow when it lands
        // `inFlightDataRoutes` in `completeNavigation`
        if (isNonHMR && !signal.aborted) {
          dataRoutes = [...dataRoutes];
        }
      }
      if (signal.aborted) {
        return {
          type: "aborted"
        };
      }
      let newMatches = matchRoutes(routesToUse, pathname, basename);
      if (newMatches) {
        return {
          type: "success",
          matches: newMatches
        };
      }
      let newPartialMatches = matchRoutesImpl(routesToUse, pathname, basename, true);
      // Avoid loops if the second pass results in the same partial matches
      if (!newPartialMatches || partialMatches.length === newPartialMatches.length && partialMatches.every((m, i) => m.route.id === newPartialMatches[i].route.id)) {
        return {
          type: "success",
          matches: null
        };
      }
      partialMatches = newPartialMatches;
    }
  }
  function _internalSetRoutes(newRoutes) {
    manifest = {};
    inFlightDataRoutes = convertRoutesToDataRoutes(newRoutes, mapRouteProperties, undefined, manifest);
  }
  function patchRoutes(routeId, children) {
    let isNonHMR = inFlightDataRoutes == null;
    let routesToUse = inFlightDataRoutes || dataRoutes;
    patchRoutesImpl(routeId, children, routesToUse, manifest, mapRouteProperties);
    // If we are not in the middle of an HMR revalidation and we changed the
    // routes, provide a new identity and trigger a reflow via `updateState`
    // to re-run memoized `router.routes` dependencies.
    // HMR will already update the identity and reflow when it lands
    // `inFlightDataRoutes` in `completeNavigation`
    if (isNonHMR) {
      dataRoutes = [...dataRoutes];
      updateState({});
    }
  }
  router = {
    get basename() {
      return basename;
    },
    get future() {
      return future;
    },
    get state() {
      return state;
    },
    get routes() {
      return dataRoutes;
    },
    get window() {
      return routerWindow;
    },
    initialize,
    subscribe,
    enableScrollRestoration,
    navigate,
    fetch,
    revalidate,
    // Passthrough to history-aware createHref used by useHref so we get proper
    // hash-aware URLs in DOM paths
    createHref: to => init.history.createHref(to),
    encodeLocation: to => init.history.encodeLocation(to),
    getFetcher,
    deleteFetcher: deleteFetcherAndUpdateState,
    dispose,
    getBlocker,
    deleteBlocker,
    patchRoutes,
    _internalFetchControllers: fetchControllers,
    _internalActiveDeferreds: activeDeferreds,
    // TODO: Remove setRoutes, it's temporary to avoid dealing with
    // updating the tree while validating the update algorithm.
    _internalSetRoutes
  };
  return router;
}
//#endregion
////////////////////////////////////////////////////////////////////////////////
//#region createStaticHandler
////////////////////////////////////////////////////////////////////////////////
const UNSAFE_DEFERRED_SYMBOL = Symbol("deferred");
function createStaticHandler(routes, opts) {
  invariant(routes.length > 0, "You must provide a non-empty routes array to createStaticHandler");
  let manifest = {};
  let basename = (opts ? opts.basename : null) || "/";
  let mapRouteProperties;
  if (opts != null && opts.mapRouteProperties) {
    mapRouteProperties = opts.mapRouteProperties;
  } else if (opts != null && opts.detectErrorBoundary) {
    // If they are still using the deprecated version, wrap it with the new API
    let detectErrorBoundary = opts.detectErrorBoundary;
    mapRouteProperties = route => ({
      hasErrorBoundary: detectErrorBoundary(route)
    });
  } else {
    mapRouteProperties = defaultMapRouteProperties;
  }
  // Config driven behavior flags
  let future = _extends({
    v7_relativeSplatPath: false,
    v7_throwAbortReason: false
  }, opts ? opts.future : null);
  let dataRoutes = convertRoutesToDataRoutes(routes, mapRouteProperties, undefined, manifest);
  /**
   * The query() method is intended for document requests, in which we want to
   * call an optional action and potentially multiple loaders for all nested
   * routes.  It returns a StaticHandlerContext object, which is very similar
   * to the router state (location, loaderData, actionData, errors, etc.) and
   * also adds SSR-specific information such as the statusCode and headers
   * from action/loaders Responses.
   *
   * It _should_ never throw and should report all errors through the
   * returned context.errors object, properly associating errors to their error
   * boundary.  Additionally, it tracks _deepestRenderedBoundaryId which can be
   * used to emulate React error boundaries during SSr by performing a second
   * pass only down to the boundaryId.
   *
   * The one exception where we do not return a StaticHandlerContext is when a
   * redirect response is returned or thrown from any action/loader.  We
   * propagate that out and return the raw Response so the HTTP server can
   * return it directly.
   *
   * - `opts.requestContext` is an optional server context that will be passed
   *   to actions/loaders in the `context` parameter
   * - `opts.skipLoaderErrorBubbling` is an optional parameter that will prevent
   *   the bubbling of errors which allows single-fetch-type implementations
   *   where the client will handle the bubbling and we may need to return data
   *   for the handling route
   */
  async function query(request, _temp3) {
    let {
      requestContext,
      skipLoaderErrorBubbling,
      dataStrategy
    } = _temp3 === void 0 ? {} : _temp3;
    let url = new URL(request.url);
    let method = request.method;
    let location = createLocation("", createPath(url), null, "default");
    let matches = matchRoutes(dataRoutes, location, basename);
    // SSR supports HEAD requests while SPA doesn't
    if (!isValidMethod(method) && method !== "HEAD") {
      let error = getInternalRouterError(405, {
        method
      });
      let {
        matches: methodNotAllowedMatches,
        route
      } = getShortCircuitMatches(dataRoutes);
      return {
        basename,
        location,
        matches: methodNotAllowedMatches,
        loaderData: {},
        actionData: null,
        errors: {
          [route.id]: error
        },
        statusCode: error.status,
        loaderHeaders: {},
        actionHeaders: {},
        activeDeferreds: null
      };
    } else if (!matches) {
      let error = getInternalRouterError(404, {
        pathname: location.pathname
      });
      let {
        matches: notFoundMatches,
        route
      } = getShortCircuitMatches(dataRoutes);
      return {
        basename,
        location,
        matches: notFoundMatches,
        loaderData: {},
        actionData: null,
        errors: {
          [route.id]: error
        },
        statusCode: error.status,
        loaderHeaders: {},
        actionHeaders: {},
        activeDeferreds: null
      };
    }
    let result = await queryImpl(request, location, matches, requestContext, dataStrategy || null, skipLoaderErrorBubbling === true, null);
    if (isResponse(result)) {
      return result;
    }
    // When returning StaticHandlerContext, we patch back in the location here
    // since we need it for React Context.  But this helps keep our submit and
    // loadRouteData operating on a Request instead of a Location
    return _extends({
      location,
      basename
    }, result);
  }
  /**
   * The queryRoute() method is intended for targeted route requests, either
   * for fetch ?_data requests or resource route requests.  In this case, we
   * are only ever calling a single action or loader, and we are returning the
   * returned value directly.  In most cases, this will be a Response returned
   * from the action/loader, but it may be a primitive or other value as well -
   * and in such cases the calling context should handle that accordingly.
   *
   * We do respect the throw/return differentiation, so if an action/loader
   * throws, then this method will throw the value.  This is important so we
   * can do proper boundary identification in Remix where a thrown Response
   * must go to the Catch Boundary but a returned Response is happy-path.
   *
   * One thing to note is that any Router-initiated Errors that make sense
   * to associate with a status code will be thrown as an ErrorResponse
   * instance which include the raw Error, such that the calling context can
   * serialize the error as they see fit while including the proper response
   * code.  Examples here are 404 and 405 errors that occur prior to reaching
   * any user-defined loaders.
   *
   * - `opts.routeId` allows you to specify the specific route handler to call.
   *   If not provided the handler will determine the proper route by matching
   *   against `request.url`
   * - `opts.requestContext` is an optional server context that will be passed
   *    to actions/loaders in the `context` parameter
   */
  async function queryRoute(request, _temp4) {
    let {
      routeId,
      requestContext,
      dataStrategy
    } = _temp4 === void 0 ? {} : _temp4;
    let url = new URL(request.url);
    let method = request.method;
    let location = createLocation("", createPath(url), null, "default");
    let matches = matchRoutes(dataRoutes, location, basename);
    // SSR supports HEAD requests while SPA doesn't
    if (!isValidMethod(method) && method !== "HEAD" && method !== "OPTIONS") {
      throw getInternalRouterError(405, {
        method
      });
    } else if (!matches) {
      throw getInternalRouterError(404, {
        pathname: location.pathname
      });
    }
    let match = routeId ? matches.find(m => m.route.id === routeId) : getTargetMatch(matches, location);
    if (routeId && !match) {
      throw getInternalRouterError(403, {
        pathname: location.pathname,
        routeId
      });
    } else if (!match) {
      // This should never hit I don't think?
      throw getInternalRouterError(404, {
        pathname: location.pathname
      });
    }
    let result = await queryImpl(request, location, matches, requestContext, dataStrategy || null, false, match);
    if (isResponse(result)) {
      return result;
    }
    let error = result.errors ? Object.values(result.errors)[0] : undefined;
    if (error !== undefined) {
      // If we got back result.errors, that means the loader/action threw
      // _something_ that wasn't a Response, but it's not guaranteed/required
      // to be an `instanceof Error` either, so we have to use throw here to
      // preserve the "error" state outside of queryImpl.
      throw error;
    }
    // Pick off the right state value to return
    if (result.actionData) {
      return Object.values(result.actionData)[0];
    }
    if (result.loaderData) {
      var _result$activeDeferre;
      let data = Object.values(result.loaderData)[0];
      if ((_result$activeDeferre = result.activeDeferreds) != null && _result$activeDeferre[match.route.id]) {
        data[UNSAFE_DEFERRED_SYMBOL] = result.activeDeferreds[match.route.id];
      }
      return data;
    }
    return undefined;
  }
  async function queryImpl(request, location, matches, requestContext, dataStrategy, skipLoaderErrorBubbling, routeMatch) {
    invariant(request.signal, "query()/queryRoute() requests must contain an AbortController signal");
    try {
      if (isMutationMethod(request.method.toLowerCase())) {
        let result = await submit(request, matches, routeMatch || getTargetMatch(matches, location), requestContext, dataStrategy, skipLoaderErrorBubbling, routeMatch != null);
        return result;
      }
      let result = await loadRouteData(request, matches, requestContext, dataStrategy, skipLoaderErrorBubbling, routeMatch);
      return isResponse(result) ? result : _extends({}, result, {
        actionData: null,
        actionHeaders: {}
      });
    } catch (e) {
      // If the user threw/returned a Response in callLoaderOrAction for a
      // `queryRoute` call, we throw the `DataStrategyResult` to bail out early
      // and then return or throw the raw Response here accordingly
      if (isDataStrategyResult(e) && isResponse(e.result)) {
        if (e.type === ResultType.error) {
          throw e.result;
        }
        return e.result;
      }
      // Redirects are always returned since they don't propagate to catch
      // boundaries
      if (isRedirectResponse(e)) {
        return e;
      }
      throw e;
    }
  }
  async function submit(request, matches, actionMatch, requestContext, dataStrategy, skipLoaderErrorBubbling, isRouteRequest) {
    let result;
    if (!actionMatch.route.action && !actionMatch.route.lazy) {
      let error = getInternalRouterError(405, {
        method: request.method,
        pathname: new URL(request.url).pathname,
        routeId: actionMatch.route.id
      });
      if (isRouteRequest) {
        throw error;
      }
      result = {
        type: ResultType.error,
        error
      };
    } else {
      let results = await callDataStrategy("action", request, [actionMatch], matches, isRouteRequest, requestContext, dataStrategy);
      result = results[actionMatch.route.id];
      if (request.signal.aborted) {
        throwStaticHandlerAbortedError(request, isRouteRequest, future);
      }
    }
    if (isRedirectResult(result)) {
      // Uhhhh - this should never happen, we should always throw these from
      // callLoaderOrAction, but the type narrowing here keeps TS happy and we
      // can get back on the "throw all redirect responses" train here should
      // this ever happen :/
      throw new Response(null, {
        status: result.response.status,
        headers: {
          Location: result.response.headers.get("Location")
        }
      });
    }
    if (isDeferredResult(result)) {
      let error = getInternalRouterError(400, {
        type: "defer-action"
      });
      if (isRouteRequest) {
        throw error;
      }
      result = {
        type: ResultType.error,
        error
      };
    }
    if (isRouteRequest) {
      // Note: This should only be non-Response values if we get here, since
      // isRouteRequest should throw any Response received in callLoaderOrAction
      if (isErrorResult(result)) {
        throw result.error;
      }
      return {
        matches: [actionMatch],
        loaderData: {},
        actionData: {
          [actionMatch.route.id]: result.data
        },
        errors: null,
        // Note: statusCode + headers are unused here since queryRoute will
        // return the raw Response or value
        statusCode: 200,
        loaderHeaders: {},
        actionHeaders: {},
        activeDeferreds: null
      };
    }
    // Create a GET request for the loaders
    let loaderRequest = new Request(request.url, {
      headers: request.headers,
      redirect: request.redirect,
      signal: request.signal
    });
    if (isErrorResult(result)) {
      // Store off the pending error - we use it to determine which loaders
      // to call and will commit it when we complete the navigation
      let boundaryMatch = skipLoaderErrorBubbling ? actionMatch : findNearestBoundary(matches, actionMatch.route.id);
      let context = await loadRouteData(loaderRequest, matches, requestContext, dataStrategy, skipLoaderErrorBubbling, null, [boundaryMatch.route.id, result]);
      // action status codes take precedence over loader status codes
      return _extends({}, context, {
        statusCode: isRouteErrorResponse(result.error) ? result.error.status : result.statusCode != null ? result.statusCode : 500,
        actionData: null,
        actionHeaders: _extends({}, result.headers ? {
          [actionMatch.route.id]: result.headers
        } : {})
      });
    }
    let context = await loadRouteData(loaderRequest, matches, requestContext, dataStrategy, skipLoaderErrorBubbling, null);
    return _extends({}, context, {
      actionData: {
        [actionMatch.route.id]: result.data
      }
    }, result.statusCode ? {
      statusCode: result.statusCode
    } : {}, {
      actionHeaders: result.headers ? {
        [actionMatch.route.id]: result.headers
      } : {}
    });
  }
  async function loadRouteData(request, matches, requestContext, dataStrategy, skipLoaderErrorBubbling, routeMatch, pendingActionResult) {
    let isRouteRequest = routeMatch != null;
    // Short circuit if we have no loaders to run (queryRoute())
    if (isRouteRequest && !(routeMatch != null && routeMatch.route.loader) && !(routeMatch != null && routeMatch.route.lazy)) {
      throw getInternalRouterError(400, {
        method: request.method,
        pathname: new URL(request.url).pathname,
        routeId: routeMatch == null ? void 0 : routeMatch.route.id
      });
    }
    let requestMatches = routeMatch ? [routeMatch] : pendingActionResult && isErrorResult(pendingActionResult[1]) ? getLoaderMatchesUntilBoundary(matches, pendingActionResult[0]) : matches;
    let matchesToLoad = requestMatches.filter(m => m.route.loader || m.route.lazy);
    // Short circuit if we have no loaders to run (query())
    if (matchesToLoad.length === 0) {
      return {
        matches,
        // Add a null for all matched routes for proper revalidation on the client
        loaderData: matches.reduce((acc, m) => Object.assign(acc, {
          [m.route.id]: null
        }), {}),
        errors: pendingActionResult && isErrorResult(pendingActionResult[1]) ? {
          [pendingActionResult[0]]: pendingActionResult[1].error
        } : null,
        statusCode: 200,
        loaderHeaders: {},
        activeDeferreds: null
      };
    }
    let results = await callDataStrategy("loader", request, matchesToLoad, matches, isRouteRequest, requestContext, dataStrategy);
    if (request.signal.aborted) {
      throwStaticHandlerAbortedError(request, isRouteRequest, future);
    }
    // Process and commit output from loaders
    let activeDeferreds = new Map();
    let context = processRouteLoaderData(matches, results, pendingActionResult, activeDeferreds, skipLoaderErrorBubbling);
    // Add a null for any non-loader matches for proper revalidation on the client
    let executedLoaders = new Set(matchesToLoad.map(match => match.route.id));
    matches.forEach(match => {
      if (!executedLoaders.has(match.route.id)) {
        context.loaderData[match.route.id] = null;
      }
    });
    return _extends({}, context, {
      matches,
      activeDeferreds: activeDeferreds.size > 0 ? Object.fromEntries(activeDeferreds.entries()) : null
    });
  }
  // Utility wrapper for calling dataStrategy server-side without having to
  // pass around the manifest, mapRouteProperties, etc.
  async function callDataStrategy(type, request, matchesToLoad, matches, isRouteRequest, requestContext, dataStrategy) {
    let results = await callDataStrategyImpl(dataStrategy || defaultDataStrategy, type, null, request, matchesToLoad, matches, null, manifest, mapRouteProperties, requestContext);
    let dataResults = {};
    await Promise.all(matches.map(async match => {
      if (!(match.route.id in results)) {
        return;
      }
      let result = results[match.route.id];
      if (isRedirectDataStrategyResultResult(result)) {
        let response = result.result;
        // Throw redirects and let the server handle them with an HTTP redirect
        throw normalizeRelativeRoutingRedirectResponse(response, request, match.route.id, matches, basename, future.v7_relativeSplatPath);
      }
      if (isResponse(result.result) && isRouteRequest) {
        // For SSR single-route requests, we want to hand Responses back
        // directly without unwrapping
        throw result;
      }
      dataResults[match.route.id] = await convertDataStrategyResultToDataResult(result);
    }));
    return dataResults;
  }
  return {
    dataRoutes,
    query,
    queryRoute
  };
}
//#endregion
////////////////////////////////////////////////////////////////////////////////
//#region Helpers
////////////////////////////////////////////////////////////////////////////////
/**
 * Given an existing StaticHandlerContext and an error thrown at render time,
 * provide an updated StaticHandlerContext suitable for a second SSR render
 */
function getStaticContextFromError(routes, context, error) {
  let newContext = _extends({}, context, {
    statusCode: isRouteErrorResponse(error) ? error.status : 500,
    errors: {
      [context._deepestRenderedBoundaryId || routes[0].id]: error
    }
  });
  return newContext;
}
function throwStaticHandlerAbortedError(request, isRouteRequest, future) {
  if (future.v7_throwAbortReason && request.signal.reason !== undefined) {
    throw request.signal.reason;
  }
  let method = isRouteRequest ? "queryRoute" : "query";
  throw new Error(method + "() call aborted: " + request.method + " " + request.url);
}
function isSubmissionNavigation(opts) {
  return opts != null && ("formData" in opts && opts.formData != null || "body" in opts && opts.body !== undefined);
}
function normalizeTo(location, matches, basename, prependBasename, to, v7_relativeSplatPath, fromRouteId, relative) {
  let contextualMatches;
  let activeRouteMatch;
  if (fromRouteId) {
    // Grab matches up to the calling route so our route-relative logic is
    // relative to the correct source route
    contextualMatches = [];
    for (let match of matches) {
      contextualMatches.push(match);
      if (match.route.id === fromRouteId) {
        activeRouteMatch = match;
        break;
      }
    }
  } else {
    contextualMatches = matches;
    activeRouteMatch = matches[matches.length - 1];
  }
  // Resolve the relative path
  let path = resolveTo(to ? to : ".", getResolveToMatches(contextualMatches, v7_relativeSplatPath), stripBasename(location.pathname, basename) || location.pathname, relative === "path");
  // When `to` is not specified we inherit search/hash from the current
  // location, unlike when to="." and we just inherit the path.
  // See https://github.com/remix-run/remix/issues/927
  if (to == null) {
    path.search = location.search;
    path.hash = location.hash;
  }
  // Account for `?index` params when routing to the current location
  if ((to == null || to === "" || to === ".") && activeRouteMatch) {
    let nakedIndex = hasNakedIndexQuery(path.search);
    if (activeRouteMatch.route.index && !nakedIndex) {
      // Add one when we're targeting an index route
      path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
    } else if (!activeRouteMatch.route.index && nakedIndex) {
      // Remove existing ones when we're not
      let params = new URLSearchParams(path.search);
      let indexValues = params.getAll("index");
      params.delete("index");
      indexValues.filter(v => v).forEach(v => params.append("index", v));
      let qs = params.toString();
      path.search = qs ? "?" + qs : "";
    }
  }
  // If we're operating within a basename, prepend it to the pathname.  If
  // this is a root navigation, then just use the raw basename which allows
  // the basename to have full control over the presence of a trailing slash
  // on root actions
  if (prependBasename && basename !== "/") {
    path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
  }
  return createPath(path);
}
// Normalize navigation options by converting formMethod=GET formData objects to
// URLSearchParams so they behave identically to links with query params
function normalizeNavigateOptions(normalizeFormMethod, isFetcher, path, opts) {
  // Return location verbatim on non-submission navigations
  if (!opts || !isSubmissionNavigation(opts)) {
    return {
      path
    };
  }
  if (opts.formMethod && !isValidMethod(opts.formMethod)) {
    return {
      path,
      error: getInternalRouterError(405, {
        method: opts.formMethod
      })
    };
  }
  let getInvalidBodyError = () => ({
    path,
    error: getInternalRouterError(400, {
      type: "invalid-body"
    })
  });
  // Create a Submission on non-GET navigations
  let rawFormMethod = opts.formMethod || "get";
  let formMethod = normalizeFormMethod ? rawFormMethod.toUpperCase() : rawFormMethod.toLowerCase();
  let formAction = stripHashFromPath(path);
  if (opts.body !== undefined) {
    if (opts.formEncType === "text/plain") {
      // text only support POST/PUT/PATCH/DELETE submissions
      if (!isMutationMethod(formMethod)) {
        return getInvalidBodyError();
      }
      let text = typeof opts.body === "string" ? opts.body : opts.body instanceof FormData || opts.body instanceof URLSearchParams ?
      // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#plain-text-form-data
      Array.from(opts.body.entries()).reduce((acc, _ref3) => {
        let [name, value] = _ref3;
        return "" + acc + name + "=" + value + "\n";
      }, "") : String(opts.body);
      return {
        path,
        submission: {
          formMethod,
          formAction,
          formEncType: opts.formEncType,
          formData: undefined,
          json: undefined,
          text
        }
      };
    } else if (opts.formEncType === "application/json") {
      // json only supports POST/PUT/PATCH/DELETE submissions
      if (!isMutationMethod(formMethod)) {
        return getInvalidBodyError();
      }
      try {
        let json = typeof opts.body === "string" ? JSON.parse(opts.body) : opts.body;
        return {
          path,
          submission: {
            formMethod,
            formAction,
            formEncType: opts.formEncType,
            formData: undefined,
            json,
            text: undefined
          }
        };
      } catch (e) {
        return getInvalidBodyError();
      }
    }
  }
  invariant(typeof FormData === "function", "FormData is not available in this environment");
  let searchParams;
  let formData;
  if (opts.formData) {
    searchParams = convertFormDataToSearchParams(opts.formData);
    formData = opts.formData;
  } else if (opts.body instanceof FormData) {
    searchParams = convertFormDataToSearchParams(opts.body);
    formData = opts.body;
  } else if (opts.body instanceof URLSearchParams) {
    searchParams = opts.body;
    formData = convertSearchParamsToFormData(searchParams);
  } else if (opts.body == null) {
    searchParams = new URLSearchParams();
    formData = new FormData();
  } else {
    try {
      searchParams = new URLSearchParams(opts.body);
      formData = convertSearchParamsToFormData(searchParams);
    } catch (e) {
      return getInvalidBodyError();
    }
  }
  let submission = {
    formMethod,
    formAction,
    formEncType: opts && opts.formEncType || "application/x-www-form-urlencoded",
    formData,
    json: undefined,
    text: undefined
  };
  if (isMutationMethod(submission.formMethod)) {
    return {
      path,
      submission
    };
  }
  // Flatten submission onto URLSearchParams for GET submissions
  let parsedPath = parsePath(path);
  // On GET navigation submissions we can drop the ?index param from the
  // resulting location since all loaders will run.  But fetcher GET submissions
  // only run a single loader so we need to preserve any incoming ?index params
  if (isFetcher && parsedPath.search && hasNakedIndexQuery(parsedPath.search)) {
    searchParams.append("index", "");
  }
  parsedPath.search = "?" + searchParams;
  return {
    path: createPath(parsedPath),
    submission
  };
}
// Filter out all routes at/below any caught error as they aren't going to
// render so we don't need to load them
function getLoaderMatchesUntilBoundary(matches, boundaryId, includeBoundary) {
  if (includeBoundary === void 0) {
    includeBoundary = false;
  }
  let index = matches.findIndex(m => m.route.id === boundaryId);
  if (index >= 0) {
    return matches.slice(0, includeBoundary ? index + 1 : index);
  }
  return matches;
}
function getMatchesToLoad(history, state, matches, submission, location, initialHydration, skipActionErrorRevalidation, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, deletedFetchers, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, pendingActionResult) {
  let actionResult = pendingActionResult ? isErrorResult(pendingActionResult[1]) ? pendingActionResult[1].error : pendingActionResult[1].data : undefined;
  let currentUrl = history.createURL(state.location);
  let nextUrl = history.createURL(location);
  // Pick navigation matches that are net-new or qualify for revalidation
  let boundaryMatches = matches;
  if (initialHydration && state.errors) {
    // On initial hydration, only consider matches up to _and including_ the boundary.
    // This is inclusive to handle cases where a server loader ran successfully,
    // a child server loader bubbled up to this route, but this route has
    // `clientLoader.hydrate` so we want to still run the `clientLoader` so that
    // we have a complete version of `loaderData`
    boundaryMatches = getLoaderMatchesUntilBoundary(matches, Object.keys(state.errors)[0], true);
  } else if (pendingActionResult && isErrorResult(pendingActionResult[1])) {
    // If an action threw an error, we call loaders up to, but not including the
    // boundary
    boundaryMatches = getLoaderMatchesUntilBoundary(matches, pendingActionResult[0]);
  }
  // Don't revalidate loaders by default after action 4xx/5xx responses
  // when the flag is enabled.  They can still opt-into revalidation via
  // `shouldRevalidate` via `actionResult`
  let actionStatus = pendingActionResult ? pendingActionResult[1].statusCode : undefined;
  let shouldSkipRevalidation = skipActionErrorRevalidation && actionStatus && actionStatus >= 400;
  let navigationMatches = boundaryMatches.filter((match, index) => {
    let {
      route
    } = match;
    if (route.lazy) {
      // We haven't loaded this route yet so we don't know if it's got a loader!
      return true;
    }
    if (route.loader == null) {
      return false;
    }
    if (initialHydration) {
      return shouldLoadRouteOnHydration(route, state.loaderData, state.errors);
    }
    // Always call the loader on new route instances and pending defer cancellations
    if (isNewLoader(state.loaderData, state.matches[index], match) || cancelledDeferredRoutes.some(id => id === match.route.id)) {
      return true;
    }
    // This is the default implementation for when we revalidate.  If the route
    // provides it's own implementation, then we give them full control but
    // provide this value so they can leverage it if needed after they check
    // their own specific use cases
    let currentRouteMatch = state.matches[index];
    let nextRouteMatch = match;
    return shouldRevalidateLoader(match, _extends({
      currentUrl,
      currentParams: currentRouteMatch.params,
      nextUrl,
      nextParams: nextRouteMatch.params
    }, submission, {
      actionResult,
      actionStatus,
      defaultShouldRevalidate: shouldSkipRevalidation ? false :
      // Forced revalidation due to submission, useRevalidator, or X-Remix-Revalidate
      isRevalidationRequired || currentUrl.pathname + currentUrl.search === nextUrl.pathname + nextUrl.search ||
      // Search params affect all loaders
      currentUrl.search !== nextUrl.search || isNewRouteInstance(currentRouteMatch, nextRouteMatch)
    }));
  });
  // Pick fetcher.loads that need to be revalidated
  let revalidatingFetchers = [];
  fetchLoadMatches.forEach((f, key) => {
    // Don't revalidate:
    //  - on initial hydration (shouldn't be any fetchers then anyway)
    //  - if fetcher won't be present in the subsequent render
    //    - no longer matches the URL (v7_fetcherPersist=false)
    //    - was unmounted but persisted due to v7_fetcherPersist=true
    if (initialHydration || !matches.some(m => m.route.id === f.routeId) || deletedFetchers.has(key)) {
      return;
    }
    let fetcherMatches = matchRoutes(routesToUse, f.path, basename);
    // If the fetcher path no longer matches, push it in with null matches so
    // we can trigger a 404 in callLoadersAndMaybeResolveData.  Note this is
    // currently only a use-case for Remix HMR where the route tree can change
    // at runtime and remove a route previously loaded via a fetcher
    if (!fetcherMatches) {
      revalidatingFetchers.push({
        key,
        routeId: f.routeId,
        path: f.path,
        matches: null,
        match: null,
        controller: null
      });
      return;
    }
    // Revalidating fetchers are decoupled from the route matches since they
    // load from a static href.  They revalidate based on explicit revalidation
    // (submission, useRevalidator, or X-Remix-Revalidate)
    let fetcher = state.fetchers.get(key);
    let fetcherMatch = getTargetMatch(fetcherMatches, f.path);
    let shouldRevalidate = false;
    if (fetchRedirectIds.has(key)) {
      // Never trigger a revalidation of an actively redirecting fetcher
      shouldRevalidate = false;
    } else if (cancelledFetcherLoads.has(key)) {
      // Always mark for revalidation if the fetcher was cancelled
      cancelledFetcherLoads.delete(key);
      shouldRevalidate = true;
    } else if (fetcher && fetcher.state !== "idle" && fetcher.data === undefined) {
      // If the fetcher hasn't ever completed loading yet, then this isn't a
      // revalidation, it would just be a brand new load if an explicit
      // revalidation is required
      shouldRevalidate = isRevalidationRequired;
    } else {
      // Otherwise fall back on any user-defined shouldRevalidate, defaulting
      // to explicit revalidations only
      shouldRevalidate = shouldRevalidateLoader(fetcherMatch, _extends({
        currentUrl,
        currentParams: state.matches[state.matches.length - 1].params,
        nextUrl,
        nextParams: matches[matches.length - 1].params
      }, submission, {
        actionResult,
        actionStatus,
        defaultShouldRevalidate: shouldSkipRevalidation ? false : isRevalidationRequired
      }));
    }
    if (shouldRevalidate) {
      revalidatingFetchers.push({
        key,
        routeId: f.routeId,
        path: f.path,
        matches: fetcherMatches,
        match: fetcherMatch,
        controller: new AbortController()
      });
    }
  });
  return [navigationMatches, revalidatingFetchers];
}
function shouldLoadRouteOnHydration(route, loaderData, errors) {
  // We dunno if we have a loader - gotta find out!
  if (route.lazy) {
    return true;
  }
  // No loader, nothing to initialize
  if (!route.loader) {
    return false;
  }
  let hasData = loaderData != null && loaderData[route.id] !== undefined;
  let hasError = errors != null && errors[route.id] !== undefined;
  // Don't run if we error'd during SSR
  if (!hasData && hasError) {
    return false;
  }
  // Explicitly opting-in to running on hydration
  if (typeof route.loader === "function" && route.loader.hydrate === true) {
    return true;
  }
  // Otherwise, run if we're not yet initialized with anything
  return !hasData && !hasError;
}
function isNewLoader(currentLoaderData, currentMatch, match) {
  let isNew =
  // [a] -> [a, b]
  !currentMatch ||
  // [a, b] -> [a, c]
  match.route.id !== currentMatch.route.id;
  // Handle the case that we don't have data for a re-used route, potentially
  // from a prior error or from a cancelled pending deferred
  let isMissingData = currentLoaderData[match.route.id] === undefined;
  // Always load if this is a net-new route or we don't yet have data
  return isNew || isMissingData;
}
function isNewRouteInstance(currentMatch, match) {
  let currentPath = currentMatch.route.path;
  return (
    // param change for this match, /users/123 -> /users/456
    currentMatch.pathname !== match.pathname ||
    // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    currentPath != null && currentPath.endsWith("*") && currentMatch.params["*"] !== match.params["*"]
  );
}
function shouldRevalidateLoader(loaderMatch, arg) {
  if (loaderMatch.route.shouldRevalidate) {
    let routeChoice = loaderMatch.route.shouldRevalidate(arg);
    if (typeof routeChoice === "boolean") {
      return routeChoice;
    }
  }
  return arg.defaultShouldRevalidate;
}
function patchRoutesImpl(routeId, children, routesToUse, manifest, mapRouteProperties) {
  var _childrenToPatch;
  let childrenToPatch;
  if (routeId) {
    let route = manifest[routeId];
    invariant(route, "No route found to patch children into: routeId = " + routeId);
    if (!route.children) {
      route.children = [];
    }
    childrenToPatch = route.children;
  } else {
    childrenToPatch = routesToUse;
  }
  // Don't patch in routes we already know about so that `patch` is idempotent
  // to simplify user-land code. This is useful because we re-call the
  // `patchRoutesOnNavigation` function for matched routes with params.
  let uniqueChildren = children.filter(newRoute => !childrenToPatch.some(existingRoute => isSameRoute(newRoute, existingRoute)));
  let newRoutes = convertRoutesToDataRoutes(uniqueChildren, mapRouteProperties, [routeId || "_", "patch", String(((_childrenToPatch = childrenToPatch) == null ? void 0 : _childrenToPatch.length) || "0")], manifest);
  childrenToPatch.push(...newRoutes);
}
function isSameRoute(newRoute, existingRoute) {
  // Most optimal check is by id
  if ("id" in newRoute && "id" in existingRoute && newRoute.id === existingRoute.id) {
    return true;
  }
  // Second is by pathing differences
  if (!(newRoute.index === existingRoute.index && newRoute.path === existingRoute.path && newRoute.caseSensitive === existingRoute.caseSensitive)) {
    return false;
  }
  // Pathless layout routes are trickier since we need to check children.
  // If they have no children then they're the same as far as we can tell
  if ((!newRoute.children || newRoute.children.length === 0) && (!existingRoute.children || existingRoute.children.length === 0)) {
    return true;
  }
  // Otherwise, we look to see if every child in the new route is already
  // represented in the existing route's children
  return newRoute.children.every((aChild, i) => {
    var _existingRoute$childr;
    return (_existingRoute$childr = existingRoute.children) == null ? void 0 : _existingRoute$childr.some(bChild => isSameRoute(aChild, bChild));
  });
}
/**
 * Execute route.lazy() methods to lazily load route modules (loader, action,
 * shouldRevalidate) and update the routeManifest in place which shares objects
 * with dataRoutes so those get updated as well.
 */
async function loadLazyRouteModule(route, mapRouteProperties, manifest) {
  if (!route.lazy) {
    return;
  }
  let lazyRoute = await route.lazy();
  // If the lazy route function was executed and removed by another parallel
  // call then we can return - first lazy() to finish wins because the return
  // value of lazy is expected to be static
  if (!route.lazy) {
    return;
  }
  let routeToUpdate = manifest[route.id];
  invariant(routeToUpdate, "No route found in manifest");
  // Update the route in place.  This should be safe because there's no way
  // we could yet be sitting on this route as we can't get there without
  // resolving lazy() first.
  //
  // This is different than the HMR "update" use-case where we may actively be
  // on the route being updated.  The main concern boils down to "does this
  // mutation affect any ongoing navigations or any current state.matches
  // values?".  If not, it should be safe to update in place.
  let routeUpdates = {};
  for (let lazyRouteProperty in lazyRoute) {
    let staticRouteValue = routeToUpdate[lazyRouteProperty];
    let isPropertyStaticallyDefined = staticRouteValue !== undefined &&
    // This property isn't static since it should always be updated based
    // on the route updates
    lazyRouteProperty !== "hasErrorBoundary";
    warning(!isPropertyStaticallyDefined, "Route \"" + routeToUpdate.id + "\" has a static property \"" + lazyRouteProperty + "\" " + "defined but its lazy function is also returning a value for this property. " + ("The lazy route property \"" + lazyRouteProperty + "\" will be ignored."));
    if (!isPropertyStaticallyDefined && !immutableRouteKeys.has(lazyRouteProperty)) {
      routeUpdates[lazyRouteProperty] = lazyRoute[lazyRouteProperty];
    }
  }
  // Mutate the route with the provided updates.  Do this first so we pass
  // the updated version to mapRouteProperties
  Object.assign(routeToUpdate, routeUpdates);
  // Mutate the `hasErrorBoundary` property on the route based on the route
  // updates and remove the `lazy` function so we don't resolve the lazy
  // route again.
  Object.assign(routeToUpdate, _extends({}, mapRouteProperties(routeToUpdate), {
    lazy: undefined
  }));
}
// Default implementation of `dataStrategy` which fetches all loaders in parallel
async function defaultDataStrategy(_ref4) {
  let {
    matches
  } = _ref4;
  let matchesToLoad = matches.filter(m => m.shouldLoad);
  let results = await Promise.all(matchesToLoad.map(m => m.resolve()));
  return results.reduce((acc, result, i) => Object.assign(acc, {
    [matchesToLoad[i].route.id]: result
  }), {});
}
async function callDataStrategyImpl(dataStrategyImpl, type, state, request, matchesToLoad, matches, fetcherKey, manifest, mapRouteProperties, requestContext) {
  let loadRouteDefinitionsPromises = matches.map(m => m.route.lazy ? loadLazyRouteModule(m.route, mapRouteProperties, manifest) : undefined);
  let dsMatches = matches.map((match, i) => {
    let loadRoutePromise = loadRouteDefinitionsPromises[i];
    let shouldLoad = matchesToLoad.some(m => m.route.id === match.route.id);
    // `resolve` encapsulates route.lazy(), executing the loader/action,
    // and mapping return values/thrown errors to a `DataStrategyResult`.  Users
    // can pass a callback to take fine-grained control over the execution
    // of the loader/action
    let resolve = async handlerOverride => {
      if (handlerOverride && request.method === "GET" && (match.route.lazy || match.route.loader)) {
        shouldLoad = true;
      }
      return shouldLoad ? callLoaderOrAction(type, request, match, loadRoutePromise, handlerOverride, requestContext) : Promise.resolve({
        type: ResultType.data,
        result: undefined
      });
    };
    return _extends({}, match, {
      shouldLoad,
      resolve
    });
  });
  // Send all matches here to allow for a middleware-type implementation.
  // handler will be a no-op for unneeded routes and we filter those results
  // back out below.
  let results = await dataStrategyImpl({
    matches: dsMatches,
    request,
    params: matches[0].params,
    fetcherKey,
    context: requestContext
  });
  // Wait for all routes to load here but 'swallow the error since we want
  // it to bubble up from the `await loadRoutePromise` in `callLoaderOrAction` -
  // called from `match.resolve()`
  try {
    await Promise.all(loadRouteDefinitionsPromises);
  } catch (e) {
    // No-op
  }
  return results;
}
// Default logic for calling a loader/action is the user has no specified a dataStrategy
async function callLoaderOrAction(type, request, match, loadRoutePromise, handlerOverride, staticContext) {
  let result;
  let onReject;
  let runHandler = handler => {
    // Setup a promise we can race against so that abort signals short circuit
    let reject;
    // This will never resolve so safe to type it as Promise<DataStrategyResult> to
    // satisfy the function return value
    let abortPromise = new Promise((_, r) => reject = r);
    onReject = () => reject();
    request.signal.addEventListener("abort", onReject);
    let actualHandler = ctx => {
      if (typeof handler !== "function") {
        return Promise.reject(new Error("You cannot call the handler for a route which defines a boolean " + ("\"" + type + "\" [routeId: " + match.route.id + "]")));
      }
      return handler({
        request,
        params: match.params,
        context: staticContext
      }, ...(ctx !== undefined ? [ctx] : []));
    };
    let handlerPromise = (async () => {
      try {
        let val = await (handlerOverride ? handlerOverride(ctx => actualHandler(ctx)) : actualHandler());
        return {
          type: "data",
          result: val
        };
      } catch (e) {
        return {
          type: "error",
          result: e
        };
      }
    })();
    return Promise.race([handlerPromise, abortPromise]);
  };
  try {
    let handler = match.route[type];
    // If we have a route.lazy promise, await that first
    if (loadRoutePromise) {
      if (handler) {
        // Run statically defined handler in parallel with lazy()
        let handlerError;
        let [value] = await Promise.all([
        // If the handler throws, don't let it immediately bubble out,
        // since we need to let the lazy() execution finish so we know if this
        // route has a boundary that can handle the error
        runHandler(handler).catch(e => {
          handlerError = e;
        }), loadRoutePromise]);
        if (handlerError !== undefined) {
          throw handlerError;
        }
        result = value;
      } else {
        // Load lazy route module, then run any returned handler
        await loadRoutePromise;
        handler = match.route[type];
        if (handler) {
          // Handler still runs even if we got interrupted to maintain consistency
          // with un-abortable behavior of handler execution on non-lazy or
          // previously-lazy-loaded routes
          result = await runHandler(handler);
        } else if (type === "action") {
          let url = new URL(request.url);
          let pathname = url.pathname + url.search;
          throw getInternalRouterError(405, {
            method: request.method,
            pathname,
            routeId: match.route.id
          });
        } else {
          // lazy() route has no loader to run.  Short circuit here so we don't
          // hit the invariant below that errors on returning undefined.
          return {
            type: ResultType.data,
            result: undefined
          };
        }
      }
    } else if (!handler) {
      let url = new URL(request.url);
      let pathname = url.pathname + url.search;
      throw getInternalRouterError(404, {
        pathname
      });
    } else {
      result = await runHandler(handler);
    }
    invariant(result.result !== undefined, "You defined " + (type === "action" ? "an action" : "a loader") + " for route " + ("\"" + match.route.id + "\" but didn't return anything from your `" + type + "` ") + "function. Please return a value or `null`.");
  } catch (e) {
    // We should already be catching and converting normal handler executions to
    // DataStrategyResults and returning them, so anything that throws here is an
    // unexpected error we still need to wrap
    return {
      type: ResultType.error,
      result: e
    };
  } finally {
    if (onReject) {
      request.signal.removeEventListener("abort", onReject);
    }
  }
  return result;
}
async function convertDataStrategyResultToDataResult(dataStrategyResult) {
  let {
    result,
    type
  } = dataStrategyResult;
  if (isResponse(result)) {
    let data;
    try {
      let contentType = result.headers.get("Content-Type");
      // Check between word boundaries instead of startsWith() due to the last
      // paragraph of https://httpwg.org/specs/rfc9110.html#field.content-type
      if (contentType && /\bapplication\/json\b/.test(contentType)) {
        if (result.body == null) {
          data = null;
        } else {
          data = await result.json();
        }
      } else {
        data = await result.text();
      }
    } catch (e) {
      return {
        type: ResultType.error,
        error: e
      };
    }
    if (type === ResultType.error) {
      return {
        type: ResultType.error,
        error: new ErrorResponseImpl(result.status, result.statusText, data),
        statusCode: result.status,
        headers: result.headers
      };
    }
    return {
      type: ResultType.data,
      data,
      statusCode: result.status,
      headers: result.headers
    };
  }
  if (type === ResultType.error) {
    if (isDataWithResponseInit(result)) {
      var _result$init3, _result$init4;
      if (result.data instanceof Error) {
        var _result$init, _result$init2;
        return {
          type: ResultType.error,
          error: result.data,
          statusCode: (_result$init = result.init) == null ? void 0 : _result$init.status,
          headers: (_result$init2 = result.init) != null && _result$init2.headers ? new Headers(result.init.headers) : undefined
        };
      }
      // Convert thrown data() to ErrorResponse instances
      return {
        type: ResultType.error,
        error: new ErrorResponseImpl(((_result$init3 = result.init) == null ? void 0 : _result$init3.status) || 500, undefined, result.data),
        statusCode: isRouteErrorResponse(result) ? result.status : undefined,
        headers: (_result$init4 = result.init) != null && _result$init4.headers ? new Headers(result.init.headers) : undefined
      };
    }
    return {
      type: ResultType.error,
      error: result,
      statusCode: isRouteErrorResponse(result) ? result.status : undefined
    };
  }
  if (isDeferredData(result)) {
    var _result$init5, _result$init6;
    return {
      type: ResultType.deferred,
      deferredData: result,
      statusCode: (_result$init5 = result.init) == null ? void 0 : _result$init5.status,
      headers: ((_result$init6 = result.init) == null ? void 0 : _result$init6.headers) && new Headers(result.init.headers)
    };
  }
  if (isDataWithResponseInit(result)) {
    var _result$init7, _result$init8;
    return {
      type: ResultType.data,
      data: result.data,
      statusCode: (_result$init7 = result.init) == null ? void 0 : _result$init7.status,
      headers: (_result$init8 = result.init) != null && _result$init8.headers ? new Headers(result.init.headers) : undefined
    };
  }
  return {
    type: ResultType.data,
    data: result
  };
}
// Support relative routing in internal redirects
function normalizeRelativeRoutingRedirectResponse(response, request, routeId, matches, basename, v7_relativeSplatPath) {
  let location = response.headers.get("Location");
  invariant(location, "Redirects returned/thrown from loaders/actions must have a Location header");
  if (!ABSOLUTE_URL_REGEX.test(location)) {
    let trimmedMatches = matches.slice(0, matches.findIndex(m => m.route.id === routeId) + 1);
    location = normalizeTo(new URL(request.url), trimmedMatches, basename, true, location, v7_relativeSplatPath);
    response.headers.set("Location", location);
  }
  return response;
}
function normalizeRedirectLocation(location, currentUrl, basename) {
  if (ABSOLUTE_URL_REGEX.test(location)) {
    // Strip off the protocol+origin for same-origin + same-basename absolute redirects
    let normalizedLocation = location;
    let url = normalizedLocation.startsWith("//") ? new URL(currentUrl.protocol + normalizedLocation) : new URL(normalizedLocation);
    let isSameBasename = stripBasename(url.pathname, basename) != null;
    if (url.origin === currentUrl.origin && isSameBasename) {
      return url.pathname + url.search + url.hash;
    }
  }
  return location;
}
// Utility method for creating the Request instances for loaders/actions during
// client-side navigations and fetches.  During SSR we will always have a
// Request instance from the static handler (query/queryRoute)
function createClientSideRequest(history, location, signal, submission) {
  let url = history.createURL(stripHashFromPath(location)).toString();
  let init = {
    signal
  };
  if (submission && isMutationMethod(submission.formMethod)) {
    let {
      formMethod,
      formEncType
    } = submission;
    // Didn't think we needed this but it turns out unlike other methods, patch
    // won't be properly normalized to uppercase and results in a 405 error.
    // See: https://fetch.spec.whatwg.org/#concept-method
    init.method = formMethod.toUpperCase();
    if (formEncType === "application/json") {
      init.headers = new Headers({
        "Content-Type": formEncType
      });
      init.body = JSON.stringify(submission.json);
    } else if (formEncType === "text/plain") {
      // Content-Type is inferred (https://fetch.spec.whatwg.org/#dom-request)
      init.body = submission.text;
    } else if (formEncType === "application/x-www-form-urlencoded" && submission.formData) {
      // Content-Type is inferred (https://fetch.spec.whatwg.org/#dom-request)
      init.body = convertFormDataToSearchParams(submission.formData);
    } else {
      // Content-Type is inferred (https://fetch.spec.whatwg.org/#dom-request)
      init.body = submission.formData;
    }
  }
  return new Request(url, init);
}
function convertFormDataToSearchParams(formData) {
  let searchParams = new URLSearchParams();
  for (let [key, value] of formData.entries()) {
    // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#converting-an-entry-list-to-a-list-of-name-value-pairs
    searchParams.append(key, typeof value === "string" ? value : value.name);
  }
  return searchParams;
}
function convertSearchParamsToFormData(searchParams) {
  let formData = new FormData();
  for (let [key, value] of searchParams.entries()) {
    formData.append(key, value);
  }
  return formData;
}
function processRouteLoaderData(matches, results, pendingActionResult, activeDeferreds, skipLoaderErrorBubbling) {
  // Fill in loaderData/errors from our loaders
  let loaderData = {};
  let errors = null;
  let statusCode;
  let foundError = false;
  let loaderHeaders = {};
  let pendingError = pendingActionResult && isErrorResult(pendingActionResult[1]) ? pendingActionResult[1].error : undefined;
  // Process loader results into state.loaderData/state.errors
  matches.forEach(match => {
    if (!(match.route.id in results)) {
      return;
    }
    let id = match.route.id;
    let result = results[id];
    invariant(!isRedirectResult(result), "Cannot handle redirect results in processLoaderData");
    if (isErrorResult(result)) {
      let error = result.error;
      // If we have a pending action error, we report it at the highest-route
      // that throws a loader error, and then clear it out to indicate that
      // it was consumed
      if (pendingError !== undefined) {
        error = pendingError;
        pendingError = undefined;
      }
      errors = errors || {};
      if (skipLoaderErrorBubbling) {
        errors[id] = error;
      } else {
        // Look upwards from the matched route for the closest ancestor error
        // boundary, defaulting to the root match.  Prefer higher error values
        // if lower errors bubble to the same boundary
        let boundaryMatch = findNearestBoundary(matches, id);
        if (errors[boundaryMatch.route.id] == null) {
          errors[boundaryMatch.route.id] = error;
        }
      }
      // Clear our any prior loaderData for the throwing route
      loaderData[id] = undefined;
      // Once we find our first (highest) error, we set the status code and
      // prevent deeper status codes from overriding
      if (!foundError) {
        foundError = true;
        statusCode = isRouteErrorResponse(result.error) ? result.error.status : 500;
      }
      if (result.headers) {
        loaderHeaders[id] = result.headers;
      }
    } else {
      if (isDeferredResult(result)) {
        activeDeferreds.set(id, result.deferredData);
        loaderData[id] = result.deferredData.data;
        // Error status codes always override success status codes, but if all
        // loaders are successful we take the deepest status code.
        if (result.statusCode != null && result.statusCode !== 200 && !foundError) {
          statusCode = result.statusCode;
        }
        if (result.headers) {
          loaderHeaders[id] = result.headers;
        }
      } else {
        loaderData[id] = result.data;
        // Error status codes always override success status codes, but if all
        // loaders are successful we take the deepest status code.
        if (result.statusCode && result.statusCode !== 200 && !foundError) {
          statusCode = result.statusCode;
        }
        if (result.headers) {
          loaderHeaders[id] = result.headers;
        }
      }
    }
  });
  // If we didn't consume the pending action error (i.e., all loaders
  // resolved), then consume it here.  Also clear out any loaderData for the
  // throwing route
  if (pendingError !== undefined && pendingActionResult) {
    errors = {
      [pendingActionResult[0]]: pendingError
    };
    loaderData[pendingActionResult[0]] = undefined;
  }
  return {
    loaderData,
    errors,
    statusCode: statusCode || 200,
    loaderHeaders
  };
}
function processLoaderData(state, matches, results, pendingActionResult, revalidatingFetchers, fetcherResults, activeDeferreds) {
  let {
    loaderData,
    errors
  } = processRouteLoaderData(matches, results, pendingActionResult, activeDeferreds, false // This method is only called client side so we always want to bubble
  );
  // Process results from our revalidating fetchers
  revalidatingFetchers.forEach(rf => {
    let {
      key,
      match,
      controller
    } = rf;
    let result = fetcherResults[key];
    invariant(result, "Did not find corresponding fetcher result");
    // Process fetcher non-redirect errors
    if (controller && controller.signal.aborted) {
      // Nothing to do for aborted fetchers
      return;
    } else if (isErrorResult(result)) {
      let boundaryMatch = findNearestBoundary(state.matches, match == null ? void 0 : match.route.id);
      if (!(errors && errors[boundaryMatch.route.id])) {
        errors = _extends({}, errors, {
          [boundaryMatch.route.id]: result.error
        });
      }
      state.fetchers.delete(key);
    } else if (isRedirectResult(result)) {
      // Should never get here, redirects should get processed above, but we
      // keep this to type narrow to a success result in the else
      invariant(false, "Unhandled fetcher revalidation redirect");
    } else if (isDeferredResult(result)) {
      // Should never get here, deferred data should be awaited for fetchers
      // in resolveDeferredResults
      invariant(false, "Unhandled fetcher deferred data");
    } else {
      let doneFetcher = getDoneFetcher(result.data);
      state.fetchers.set(key, doneFetcher);
    }
  });
  return {
    loaderData,
    errors
  };
}
function mergeLoaderData(loaderData, newLoaderData, matches, errors) {
  let mergedLoaderData = _extends({}, newLoaderData);
  for (let match of matches) {
    let id = match.route.id;
    if (newLoaderData.hasOwnProperty(id)) {
      if (newLoaderData[id] !== undefined) {
        mergedLoaderData[id] = newLoaderData[id];
      }
    } else if (loaderData[id] !== undefined && match.route.loader) {
      // Preserve existing keys not included in newLoaderData and where a loader
      // wasn't removed by HMR
      mergedLoaderData[id] = loaderData[id];
    }
    if (errors && errors.hasOwnProperty(id)) {
      // Don't keep any loader data below the boundary
      break;
    }
  }
  return mergedLoaderData;
}
function getActionDataForCommit(pendingActionResult) {
  if (!pendingActionResult) {
    return {};
  }
  return isErrorResult(pendingActionResult[1]) ? {
    // Clear out prior actionData on errors
    actionData: {}
  } : {
    actionData: {
      [pendingActionResult[0]]: pendingActionResult[1].data
    }
  };
}
// Find the nearest error boundary, looking upwards from the leaf route (or the
// route specified by routeId) for the closest ancestor error boundary,
// defaulting to the root match
function findNearestBoundary(matches, routeId) {
  let eligibleMatches = routeId ? matches.slice(0, matches.findIndex(m => m.route.id === routeId) + 1) : [...matches];
  return eligibleMatches.reverse().find(m => m.route.hasErrorBoundary === true) || matches[0];
}
function getShortCircuitMatches(routes) {
  // Prefer a root layout route if present, otherwise shim in a route object
  let route = routes.length === 1 ? routes[0] : routes.find(r => r.index || !r.path || r.path === "/") || {
    id: "__shim-error-route__"
  };
  return {
    matches: [{
      params: {},
      pathname: "",
      pathnameBase: "",
      route
    }],
    route
  };
}
function getInternalRouterError(status, _temp5) {
  let {
    pathname,
    routeId,
    method,
    type,
    message
  } = _temp5 === void 0 ? {} : _temp5;
  let statusText = "Unknown Server Error";
  let errorMessage = "Unknown @remix-run/router error";
  if (status === 400) {
    statusText = "Bad Request";
    if (method && pathname && routeId) {
      errorMessage = "You made a " + method + " request to \"" + pathname + "\" but " + ("did not provide a `loader` for route \"" + routeId + "\", ") + "so there is no way to handle the request.";
    } else if (type === "defer-action") {
      errorMessage = "defer() is not supported in actions";
    } else if (type === "invalid-body") {
      errorMessage = "Unable to encode submission body";
    }
  } else if (status === 403) {
    statusText = "Forbidden";
    errorMessage = "Route \"" + routeId + "\" does not match URL \"" + pathname + "\"";
  } else if (status === 404) {
    statusText = "Not Found";
    errorMessage = "No route matches URL \"" + pathname + "\"";
  } else if (status === 405) {
    statusText = "Method Not Allowed";
    if (method && pathname && routeId) {
      errorMessage = "You made a " + method.toUpperCase() + " request to \"" + pathname + "\" but " + ("did not provide an `action` for route \"" + routeId + "\", ") + "so there is no way to handle the request.";
    } else if (method) {
      errorMessage = "Invalid request method \"" + method.toUpperCase() + "\"";
    }
  }
  return new ErrorResponseImpl(status || 500, statusText, new Error(errorMessage), true);
}
// Find any returned redirect errors, starting from the lowest match
function findRedirect(results) {
  let entries = Object.entries(results);
  for (let i = entries.length - 1; i >= 0; i--) {
    let [key, result] = entries[i];
    if (isRedirectResult(result)) {
      return {
        key,
        result
      };
    }
  }
}
function stripHashFromPath(path) {
  let parsedPath = typeof path === "string" ? parsePath(path) : path;
  return createPath(_extends({}, parsedPath, {
    hash: ""
  }));
}
function isHashChangeOnly(a, b) {
  if (a.pathname !== b.pathname || a.search !== b.search) {
    return false;
  }
  if (a.hash === "") {
    // /page -> /page#hash
    return b.hash !== "";
  } else if (a.hash === b.hash) {
    // /page#hash -> /page#hash
    return true;
  } else if (b.hash !== "") {
    // /page#hash -> /page#other
    return true;
  }
  // If the hash is removed the browser will re-perform a request to the server
  // /page#hash -> /page
  return false;
}
function isDataStrategyResult(result) {
  return result != null && typeof result === "object" && "type" in result && "result" in result && (result.type === ResultType.data || result.type === ResultType.error);
}
function isRedirectDataStrategyResultResult(result) {
  return isResponse(result.result) && redirectStatusCodes.has(result.result.status);
}
function isDeferredResult(result) {
  return result.type === ResultType.deferred;
}
function isErrorResult(result) {
  return result.type === ResultType.error;
}
function isRedirectResult(result) {
  return (result && result.type) === ResultType.redirect;
}
function isDataWithResponseInit(value) {
  return typeof value === "object" && value != null && "type" in value && "data" in value && "init" in value && value.type === "DataWithResponseInit";
}
function isDeferredData(value) {
  let deferred = value;
  return deferred && typeof deferred === "object" && typeof deferred.data === "object" && typeof deferred.subscribe === "function" && typeof deferred.cancel === "function" && typeof deferred.resolveData === "function";
}
function isResponse(value) {
  return value != null && typeof value.status === "number" && typeof value.statusText === "string" && typeof value.headers === "object" && typeof value.body !== "undefined";
}
function isRedirectResponse(result) {
  if (!isResponse(result)) {
    return false;
  }
  let status = result.status;
  let location = result.headers.get("Location");
  return status >= 300 && status <= 399 && location != null;
}
function isValidMethod(method) {
  return validRequestMethods.has(method.toLowerCase());
}
function isMutationMethod(method) {
  return validMutationMethods.has(method.toLowerCase());
}
async function resolveNavigationDeferredResults(matches, results, signal, currentMatches, currentLoaderData) {
  let entries = Object.entries(results);
  for (let index = 0; index < entries.length; index++) {
    let [routeId, result] = entries[index];
    let match = matches.find(m => (m == null ? void 0 : m.route.id) === routeId);
    // If we don't have a match, then we can have a deferred result to do
    // anything with.  This is for revalidating fetchers where the route was
    // removed during HMR
    if (!match) {
      continue;
    }
    let currentMatch = currentMatches.find(m => m.route.id === match.route.id);
    let isRevalidatingLoader = currentMatch != null && !isNewRouteInstance(currentMatch, match) && (currentLoaderData && currentLoaderData[match.route.id]) !== undefined;
    if (isDeferredResult(result) && isRevalidatingLoader) {
      // Note: we do not have to touch activeDeferreds here since we race them
      // against the signal in resolveDeferredData and they'll get aborted
      // there if needed
      await resolveDeferredData(result, signal, false).then(result => {
        if (result) {
          results[routeId] = result;
        }
      });
    }
  }
}
async function resolveFetcherDeferredResults(matches, results, revalidatingFetchers) {
  for (let index = 0; index < revalidatingFetchers.length; index++) {
    let {
      key,
      routeId,
      controller
    } = revalidatingFetchers[index];
    let result = results[key];
    let match = matches.find(m => (m == null ? void 0 : m.route.id) === routeId);
    // If we don't have a match, then we can have a deferred result to do
    // anything with.  This is for revalidating fetchers where the route was
    // removed during HMR
    if (!match) {
      continue;
    }
    if (isDeferredResult(result)) {
      // Note: we do not have to touch activeDeferreds here since we race them
      // against the signal in resolveDeferredData and they'll get aborted
      // there if needed
      invariant(controller, "Expected an AbortController for revalidating fetcher deferred result");
      await resolveDeferredData(result, controller.signal, true).then(result => {
        if (result) {
          results[key] = result;
        }
      });
    }
  }
}
async function resolveDeferredData(result, signal, unwrap) {
  if (unwrap === void 0) {
    unwrap = false;
  }
  let aborted = await result.deferredData.resolveData(signal);
  if (aborted) {
    return;
  }
  if (unwrap) {
    try {
      return {
        type: ResultType.data,
        data: result.deferredData.unwrappedData
      };
    } catch (e) {
      // Handle any TrackedPromise._error values encountered while unwrapping
      return {
        type: ResultType.error,
        error: e
      };
    }
  }
  return {
    type: ResultType.data,
    data: result.deferredData.data
  };
}
function hasNakedIndexQuery(search) {
  return new URLSearchParams(search).getAll("index").some(v => v === "");
}
function getTargetMatch(matches, location) {
  let search = typeof location === "string" ? parsePath(location).search : location.search;
  if (matches[matches.length - 1].route.index && hasNakedIndexQuery(search || "")) {
    // Return the leaf index route when index is present
    return matches[matches.length - 1];
  }
  // Otherwise grab the deepest "path contributing" match (ignoring index and
  // pathless layout routes)
  let pathMatches = getPathContributingMatches(matches);
  return pathMatches[pathMatches.length - 1];
}
function getSubmissionFromNavigation(navigation) {
  let {
    formMethod,
    formAction,
    formEncType,
    text,
    formData,
    json
  } = navigation;
  if (!formMethod || !formAction || !formEncType) {
    return;
  }
  if (text != null) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData: undefined,
      json: undefined,
      text
    };
  } else if (formData != null) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData,
      json: undefined,
      text: undefined
    };
  } else if (json !== undefined) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData: undefined,
      json,
      text: undefined
    };
  }
}
function getLoadingNavigation(location, submission) {
  if (submission) {
    let navigation = {
      state: "loading",
      location,
      formMethod: submission.formMethod,
      formAction: submission.formAction,
      formEncType: submission.formEncType,
      formData: submission.formData,
      json: submission.json,
      text: submission.text
    };
    return navigation;
  } else {
    let navigation = {
      state: "loading",
      location,
      formMethod: undefined,
      formAction: undefined,
      formEncType: undefined,
      formData: undefined,
      json: undefined,
      text: undefined
    };
    return navigation;
  }
}
function getSubmittingNavigation(location, submission) {
  let navigation = {
    state: "submitting",
    location,
    formMethod: submission.formMethod,
    formAction: submission.formAction,
    formEncType: submission.formEncType,
    formData: submission.formData,
    json: submission.json,
    text: submission.text
  };
  return navigation;
}
function getLoadingFetcher(submission, data) {
  if (submission) {
    let fetcher = {
      state: "loading",
      formMethod: submission.formMethod,
      formAction: submission.formAction,
      formEncType: submission.formEncType,
      formData: submission.formData,
      json: submission.json,
      text: submission.text,
      data
    };
    return fetcher;
  } else {
    let fetcher = {
      state: "loading",
      formMethod: undefined,
      formAction: undefined,
      formEncType: undefined,
      formData: undefined,
      json: undefined,
      text: undefined,
      data
    };
    return fetcher;
  }
}
function getSubmittingFetcher(submission, existingFetcher) {
  let fetcher = {
    state: "submitting",
    formMethod: submission.formMethod,
    formAction: submission.formAction,
    formEncType: submission.formEncType,
    formData: submission.formData,
    json: submission.json,
    text: submission.text,
    data: existingFetcher ? existingFetcher.data : undefined
  };
  return fetcher;
}
function getDoneFetcher(data) {
  let fetcher = {
    state: "idle",
    formMethod: undefined,
    formAction: undefined,
    formEncType: undefined,
    formData: undefined,
    json: undefined,
    text: undefined,
    data
  };
  return fetcher;
}
function restoreAppliedTransitions(_window, transitions) {
  try {
    let sessionPositions = _window.sessionStorage.getItem(TRANSITIONS_STORAGE_KEY);
    if (sessionPositions) {
      let json = JSON.parse(sessionPositions);
      for (let [k, v] of Object.entries(json || {})) {
        if (v && Array.isArray(v)) {
          transitions.set(k, new Set(v || []));
        }
      }
    }
  } catch (e) {
    // no-op, use default empty object
  }
}
function persistAppliedTransitions(_window, transitions) {
  if (transitions.size > 0) {
    let json = {};
    for (let [k, v] of transitions) {
      json[k] = [...v];
    }
    try {
      _window.sessionStorage.setItem(TRANSITIONS_STORAGE_KEY, JSON.stringify(json));
    } catch (error) {
      warning(false, "Failed to save applied view transitions in sessionStorage (" + error + ").");
    }
  }
}
//#endregion


//# sourceMappingURL=router.js.map


/***/ }),

/***/ 5712:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "4d0d5017d71ea1750fc1.woff";

/***/ }),

/***/ 5762:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "7bff749a95dc0612fa35.woff";

/***/ }),

/***/ 5773:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Check)
/* harmony export */ });
/* unused harmony export __iconNode */
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9407);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("check", __iconNode);


//# sourceMappingURL=check.js.map


/***/ }),

/***/ 5824:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "a8de720a6f13c66c8a4e.woff2";

/***/ }),

/***/ 6019:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5072);
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7825);
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7659);
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5056);
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(540);
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1113);
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_400_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2762);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_400_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A, options);




       /* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_400_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A && _css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_400_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A.locals ? _css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_400_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A.locals : undefined);


/***/ }),

/***/ 6148:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  P2: () => (/* binding */ openDB)
});

// UNUSED EXPORTS: deleteDB, unwrap, wrap

;// ./node_modules/idb/build/wrap-idb-value.js
const instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);

let idbProxyableTypes;
let cursorAdvanceMethods;
// This is a function to prevent it throwing up in node environments.
function getIdbProxyableTypes() {
    return (idbProxyableTypes ||
        (idbProxyableTypes = [
            IDBDatabase,
            IDBObjectStore,
            IDBIndex,
            IDBCursor,
            IDBTransaction,
        ]));
}
// This is a function to prevent it throwing up in node environments.
function getCursorAdvanceMethods() {
    return (cursorAdvanceMethods ||
        (cursorAdvanceMethods = [
            IDBCursor.prototype.advance,
            IDBCursor.prototype.continue,
            IDBCursor.prototype.continuePrimaryKey,
        ]));
}
const cursorRequestMap = new WeakMap();
const transactionDoneMap = new WeakMap();
const transactionStoreNamesMap = new WeakMap();
const transformCache = new WeakMap();
const reverseTransformCache = new WeakMap();
function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
        const unlisten = () => {
            request.removeEventListener('success', success);
            request.removeEventListener('error', error);
        };
        const success = () => {
            resolve(wrap_idb_value_wrap(request.result));
            unlisten();
        };
        const error = () => {
            reject(request.error);
            unlisten();
        };
        request.addEventListener('success', success);
        request.addEventListener('error', error);
    });
    promise
        .then((value) => {
        // Since cursoring reuses the IDBRequest (*sigh*), we cache it for later retrieval
        // (see wrapFunction).
        if (value instanceof IDBCursor) {
            cursorRequestMap.set(value, request);
        }
        // Catching to avoid "Uncaught Promise exceptions"
    })
        .catch(() => { });
    // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This
    // is because we create many promises from a single IDBRequest.
    reverseTransformCache.set(promise, request);
    return promise;
}
function cacheDonePromiseForTransaction(tx) {
    // Early bail if we've already created a done promise for this transaction.
    if (transactionDoneMap.has(tx))
        return;
    const done = new Promise((resolve, reject) => {
        const unlisten = () => {
            tx.removeEventListener('complete', complete);
            tx.removeEventListener('error', error);
            tx.removeEventListener('abort', error);
        };
        const complete = () => {
            resolve();
            unlisten();
        };
        const error = () => {
            reject(tx.error || new DOMException('AbortError', 'AbortError'));
            unlisten();
        };
        tx.addEventListener('complete', complete);
        tx.addEventListener('error', error);
        tx.addEventListener('abort', error);
    });
    // Cache it for later retrieval.
    transactionDoneMap.set(tx, done);
}
let idbProxyTraps = {
    get(target, prop, receiver) {
        if (target instanceof IDBTransaction) {
            // Special handling for transaction.done.
            if (prop === 'done')
                return transactionDoneMap.get(target);
            // Polyfill for objectStoreNames because of Edge.
            if (prop === 'objectStoreNames') {
                return target.objectStoreNames || transactionStoreNamesMap.get(target);
            }
            // Make tx.store return the only store in the transaction, or undefined if there are many.
            if (prop === 'store') {
                return receiver.objectStoreNames[1]
                    ? undefined
                    : receiver.objectStore(receiver.objectStoreNames[0]);
            }
        }
        // Else transform whatever we get back.
        return wrap_idb_value_wrap(target[prop]);
    },
    set(target, prop, value) {
        target[prop] = value;
        return true;
    },
    has(target, prop) {
        if (target instanceof IDBTransaction &&
            (prop === 'done' || prop === 'store')) {
            return true;
        }
        return prop in target;
    },
};
function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
    // Due to expected object equality (which is enforced by the caching in `wrap`), we
    // only create one new func per func.
    // Edge doesn't support objectStoreNames (booo), so we polyfill it here.
    if (func === IDBDatabase.prototype.transaction &&
        !('objectStoreNames' in IDBTransaction.prototype)) {
        return function (storeNames, ...args) {
            const tx = func.call(unwrap(this), storeNames, ...args);
            transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
            return wrap_idb_value_wrap(tx);
        };
    }
    // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
    // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
    // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
    // with real promises, so each advance methods returns a new promise for the cursor object, or
    // undefined if the end of the cursor has been reached.
    if (getCursorAdvanceMethods().includes(func)) {
        return function (...args) {
            // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
            // the original object.
            func.apply(unwrap(this), args);
            return wrap_idb_value_wrap(cursorRequestMap.get(this));
        };
    }
    return function (...args) {
        // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
        // the original object.
        return wrap_idb_value_wrap(func.apply(unwrap(this), args));
    };
}
function transformCachableValue(value) {
    if (typeof value === 'function')
        return wrapFunction(value);
    // This doesn't return, it just creates a 'done' promise for the transaction,
    // which is later returned for transaction.done (see idbObjectHandler).
    if (value instanceof IDBTransaction)
        cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
        return new Proxy(value, idbProxyTraps);
    // Return the same value back if we're not going to transform it.
    return value;
}
function wrap_idb_value_wrap(value) {
    // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
    // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
    if (value instanceof IDBRequest)
        return promisifyRequest(value);
    // If we've already transformed this value before, reuse the transformed value.
    // This is faster, but it also provides object equality.
    if (transformCache.has(value))
        return transformCache.get(value);
    const newValue = transformCachableValue(value);
    // Not all types are transformed.
    // These may be primitive types, so they can't be WeakMap keys.
    if (newValue !== value) {
        transformCache.set(value, newValue);
        reverseTransformCache.set(newValue, value);
    }
    return newValue;
}
const unwrap = (value) => reverseTransformCache.get(value);



;// ./node_modules/idb/build/index.js



/**
 * Open a database.
 *
 * @param name Name of the database.
 * @param version Schema version.
 * @param callbacks Additional callbacks.
 */
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name, version);
    const openPromise = wrap_idb_value_wrap(request);
    if (upgrade) {
        request.addEventListener('upgradeneeded', (event) => {
            upgrade(wrap_idb_value_wrap(request.result), event.oldVersion, event.newVersion, wrap_idb_value_wrap(request.transaction), event);
        });
    }
    if (blocked) {
        request.addEventListener('blocked', (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion, event.newVersion, event));
    }
    openPromise
        .then((db) => {
        if (terminated)
            db.addEventListener('close', () => terminated());
        if (blocking) {
            db.addEventListener('versionchange', (event) => blocking(event.oldVersion, event.newVersion, event));
        }
    })
        .catch(() => { });
    return openPromise;
}
/**
 * Delete a database.
 *
 * @param name Name of the database.
 */
function deleteDB(name, { blocked } = {}) {
    const request = indexedDB.deleteDatabase(name);
    if (blocked) {
        request.addEventListener('blocked', (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion, event));
    }
    return wrap(request).then(() => undefined);
}

const readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
const writeMethods = ['put', 'add', 'delete', 'clear'];
const cachedMethods = new Map();
function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase &&
        !(prop in target) &&
        typeof prop === 'string')) {
        return;
    }
    if (cachedMethods.get(prop))
        return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, '');
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) ||
        !(isWrite || readMethods.includes(targetFuncName))) {
        return;
    }
    const method = async function (storeName, ...args) {
        // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
        const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
        let target = tx.store;
        if (useIndex)
            target = target.index(args.shift());
        // Must reject if op rejects.
        // If it's a write operation, must reject if tx.done rejects.
        // Must reject with op rejection first.
        // Must resolve with op value.
        // Must handle both promises (no unhandled rejections)
        return (await Promise.all([
            target[targetFuncName](...args),
            isWrite && tx.done,
        ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
}
replaceTraps((oldTraps) => ({
    ...oldTraps,
    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop),
}));




/***/ }),

/***/ 6314:
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ 6386:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "023db878f10be2203b60.woff2";

/***/ }),

/***/ 6415:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "04bb56ffa463ab55708d.woff";

/***/ }),

/***/ 6477:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "be70ab2888339fe67ac5.woff2";

/***/ }),

/***/ 6501:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "454735e8a8af2928485e.woff";

/***/ }),

/***/ 6569:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "04d33a0bd87050834f1a.woff";

/***/ }),

/***/ 6743:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1354);
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6314);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4417);
/* harmony import */ var _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(6386), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(304), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_2___ = new URL(/* asset import */ __webpack_require__(5212), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_3___ = new URL(/* asset import */ __webpack_require__(330), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_4___ = new URL(/* asset import */ __webpack_require__(7357), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_5___ = new URL(/* asset import */ __webpack_require__(4677), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_6___ = new URL(/* asset import */ __webpack_require__(7579), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_7___ = new URL(/* asset import */ __webpack_require__(9299), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_8___ = new URL(/* asset import */ __webpack_require__(7778), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_9___ = new URL(/* asset import */ __webpack_require__(6768), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_10___ = new URL(/* asset import */ __webpack_require__(7855), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_11___ = new URL(/* asset import */ __webpack_require__(2351), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_12___ = new URL(/* asset import */ __webpack_require__(7797), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_13___ = new URL(/* asset import */ __webpack_require__(5037), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_2___);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_3___);
var ___CSS_LOADER_URL_REPLACEMENT_4___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_4___);
var ___CSS_LOADER_URL_REPLACEMENT_5___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_5___);
var ___CSS_LOADER_URL_REPLACEMENT_6___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_6___);
var ___CSS_LOADER_URL_REPLACEMENT_7___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_7___);
var ___CSS_LOADER_URL_REPLACEMENT_8___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_8___);
var ___CSS_LOADER_URL_REPLACEMENT_9___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_9___);
var ___CSS_LOADER_URL_REPLACEMENT_10___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_10___);
var ___CSS_LOADER_URL_REPLACEMENT_11___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_11___);
var ___CSS_LOADER_URL_REPLACEMENT_12___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_12___);
var ___CSS_LOADER_URL_REPLACEMENT_13___ = _css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_13___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* inter-cyrillic-ext-500-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 500;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_0___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_1___}) format('woff');
  unicode-range: U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F;
}

/* inter-cyrillic-500-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 500;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_2___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_3___}) format('woff');
  unicode-range: U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116;
}

/* inter-greek-ext-500-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 500;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_4___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_5___}) format('woff');
  unicode-range: U+1F00-1FFF;
}

/* inter-greek-500-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 500;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_6___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_7___}) format('woff');
  unicode-range: U+0370-0377,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03FF;
}

/* inter-vietnamese-500-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 500;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_8___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_9___}) format('woff');
  unicode-range: U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB;
}

/* inter-latin-ext-500-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 500;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_10___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_11___}) format('woff');
  unicode-range: U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;
}

/* inter-latin-500-normal */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-display: swap;
  font-weight: 500;
  src: url(${___CSS_LOADER_URL_REPLACEMENT_12___}) format('woff2'), url(${___CSS_LOADER_URL_REPLACEMENT_13___}) format('woff');
  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
}`, "",{"version":3,"sources":["webpack://./node_modules/@fontsource/inter/500.css"],"names":[],"mappings":"AAAA,kCAAkC;AAClC;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,oHAAqI;EACrI,iFAAiF;AACnF;;AAEA,8BAA8B;AAC9B;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,oHAA6H;EAC7H,gEAAgE;AAClE;;AAEA,+BAA+B;AAC/B;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,oHAA+H;EAC/H,0BAA0B;AAC5B;;AAEA,2BAA2B;AAC3B;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,oHAAuH;EACvH,iFAAiF;AACnF;;AAEA,gCAAgC;AAChC;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,oHAAiI;EACjI,2JAA2J;AAC7J;;AAEA,+BAA+B;AAC/B;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,sHAA+H;EAC/H,iMAAiM;AACnM;;AAEA,2BAA2B;AAC3B;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;EAChB,sHAAuH;EACvH,uKAAuK;AACzK","sourcesContent":["/* inter-cyrillic-ext-500-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 500;\n  src: url(./files/inter-cyrillic-ext-500-normal.woff2) format('woff2'), url(./files/inter-cyrillic-ext-500-normal.woff) format('woff');\n  unicode-range: U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F;\n}\n\n/* inter-cyrillic-500-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 500;\n  src: url(./files/inter-cyrillic-500-normal.woff2) format('woff2'), url(./files/inter-cyrillic-500-normal.woff) format('woff');\n  unicode-range: U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116;\n}\n\n/* inter-greek-ext-500-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 500;\n  src: url(./files/inter-greek-ext-500-normal.woff2) format('woff2'), url(./files/inter-greek-ext-500-normal.woff) format('woff');\n  unicode-range: U+1F00-1FFF;\n}\n\n/* inter-greek-500-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 500;\n  src: url(./files/inter-greek-500-normal.woff2) format('woff2'), url(./files/inter-greek-500-normal.woff) format('woff');\n  unicode-range: U+0370-0377,U+037A-037F,U+0384-038A,U+038C,U+038E-03A1,U+03A3-03FF;\n}\n\n/* inter-vietnamese-500-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 500;\n  src: url(./files/inter-vietnamese-500-normal.woff2) format('woff2'), url(./files/inter-vietnamese-500-normal.woff) format('woff');\n  unicode-range: U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB;\n}\n\n/* inter-latin-ext-500-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 500;\n  src: url(./files/inter-latin-ext-500-normal.woff2) format('woff2'), url(./files/inter-latin-ext-500-normal.woff) format('woff');\n  unicode-range: U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;\n}\n\n/* inter-latin-500-normal */\n@font-face {\n  font-family: 'Inter';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 500;\n  src: url(./files/inter-latin-500-normal.woff2) format('woff2'), url(./files/inter-latin-500-normal.woff) format('woff');\n  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 6756:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "5631f054acb5a33a716a.woff2";

/***/ }),

/***/ 6768:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "296d66c0bba9086788b9.woff";

/***/ }),

/***/ 7053:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "883b5e4d36b7b0812ed4.woff";

/***/ }),

/***/ 7066:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "f10265da6bd8d66999ac.woff";

/***/ }),

/***/ 7357:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "b187635a3d8a0b90faa0.woff2";

/***/ }),

/***/ 7463:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
function f(a,b){var c=a.length;a.push(b);a:for(;0<c;){var d=c-1>>>1,e=a[d];if(0<g(e,b))a[d]=b,a[c]=e,c=d;else break a}}function h(a){return 0===a.length?null:a[0]}function k(a){if(0===a.length)return null;var b=a[0],c=a.pop();if(c!==b){a[0]=c;a:for(var d=0,e=a.length,w=e>>>1;d<w;){var m=2*(d+1)-1,C=a[m],n=m+1,x=a[n];if(0>g(C,c))n<e&&0>g(x,C)?(a[d]=x,a[n]=c,d=n):(a[d]=C,a[m]=c,d=m);else if(n<e&&0>g(x,c))a[d]=x,a[n]=c,d=n;else break a}}return b}
function g(a,b){var c=a.sortIndex-b.sortIndex;return 0!==c?c:a.id-b.id}if("object"===typeof performance&&"function"===typeof performance.now){var l=performance;exports.unstable_now=function(){return l.now()}}else{var p=Date,q=p.now();exports.unstable_now=function(){return p.now()-q}}var r=[],t=[],u=1,v=null,y=3,z=!1,A=!1,B=!1,D="function"===typeof setTimeout?setTimeout:null,E="function"===typeof clearTimeout?clearTimeout:null,F="undefined"!==typeof setImmediate?setImmediate:null;
"undefined"!==typeof navigator&&void 0!==navigator.scheduling&&void 0!==navigator.scheduling.isInputPending&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function G(a){for(var b=h(t);null!==b;){if(null===b.callback)k(t);else if(b.startTime<=a)k(t),b.sortIndex=b.expirationTime,f(r,b);else break;b=h(t)}}function H(a){B=!1;G(a);if(!A)if(null!==h(r))A=!0,I(J);else{var b=h(t);null!==b&&K(H,b.startTime-a)}}
function J(a,b){A=!1;B&&(B=!1,E(L),L=-1);z=!0;var c=y;try{G(b);for(v=h(r);null!==v&&(!(v.expirationTime>b)||a&&!M());){var d=v.callback;if("function"===typeof d){v.callback=null;y=v.priorityLevel;var e=d(v.expirationTime<=b);b=exports.unstable_now();"function"===typeof e?v.callback=e:v===h(r)&&k(r);G(b)}else k(r);v=h(r)}if(null!==v)var w=!0;else{var m=h(t);null!==m&&K(H,m.startTime-b);w=!1}return w}finally{v=null,y=c,z=!1}}var N=!1,O=null,L=-1,P=5,Q=-1;
function M(){return exports.unstable_now()-Q<P?!1:!0}function R(){if(null!==O){var a=exports.unstable_now();Q=a;var b=!0;try{b=O(!0,a)}finally{b?S():(N=!1,O=null)}}else N=!1}var S;if("function"===typeof F)S=function(){F(R)};else if("undefined"!==typeof MessageChannel){var T=new MessageChannel,U=T.port2;T.port1.onmessage=R;S=function(){U.postMessage(null)}}else S=function(){D(R,0)};function I(a){O=a;N||(N=!0,S())}function K(a,b){L=D(function(){a(exports.unstable_now())},b)}
exports.unstable_IdlePriority=5;exports.unstable_ImmediatePriority=1;exports.unstable_LowPriority=4;exports.unstable_NormalPriority=3;exports.unstable_Profiling=null;exports.unstable_UserBlockingPriority=2;exports.unstable_cancelCallback=function(a){a.callback=null};exports.unstable_continueExecution=function(){A||z||(A=!0,I(J))};
exports.unstable_forceFrameRate=function(a){0>a||125<a?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):P=0<a?Math.floor(1E3/a):5};exports.unstable_getCurrentPriorityLevel=function(){return y};exports.unstable_getFirstCallbackNode=function(){return h(r)};exports.unstable_next=function(a){switch(y){case 1:case 2:case 3:var b=3;break;default:b=y}var c=y;y=b;try{return a()}finally{y=c}};exports.unstable_pauseExecution=function(){};
exports.unstable_requestPaint=function(){};exports.unstable_runWithPriority=function(a,b){switch(a){case 1:case 2:case 3:case 4:case 5:break;default:a=3}var c=y;y=a;try{return b()}finally{y=c}};
exports.unstable_scheduleCallback=function(a,b,c){var d=exports.unstable_now();"object"===typeof c&&null!==c?(c=c.delay,c="number"===typeof c&&0<c?d+c:d):c=d;switch(a){case 1:var e=-1;break;case 2:e=250;break;case 5:e=1073741823;break;case 4:e=1E4;break;default:e=5E3}e=c+e;a={id:u++,callback:b,priorityLevel:a,startTime:c,expirationTime:e,sortIndex:-1};c>d?(a.sortIndex=c,f(t,a),null===h(r)&&a===h(t)&&(B?(E(L),L=-1):B=!0,K(H,c-d))):(a.sortIndex=e,f(r,a),A||z||(A=!0,I(J)));return a};
exports.unstable_shouldYield=M;exports.unstable_wrapCallback=function(a){var b=y;return function(){var c=y;y=b;try{return a.apply(this,arguments)}finally{y=c}}};


/***/ }),

/***/ 7490:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "f2fa0d9ef98f59d4a75b.woff2";

/***/ }),

/***/ 7536:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "02f9e7ef5cf29425f684.woff";

/***/ }),

/***/ 7579:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "0d91a975f010051e7150.woff2";

/***/ }),

/***/ 7659:
/***/ ((module) => {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ 7733:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "ce60970447cde0dd1582.woff2";

/***/ }),

/***/ 7767:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
var react__WEBPACK_IMPORTED_MODULE_0___namespace_cache;
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $P: () => (/* binding */ useHref),
/* harmony export */   C5: () => (/* binding */ Navigate),
/* harmony export */   Ix: () => (/* binding */ Router),
/* harmony export */   Rq: () => (/* binding */ DataRouterStateContext),
/* harmony export */   V8: () => (/* binding */ logV6DeprecationWarnings),
/* harmony export */   Zp: () => (/* binding */ useNavigate),
/* harmony export */   g: () => (/* binding */ useParams),
/* harmony export */   jb: () => (/* binding */ NavigationContext),
/* harmony export */   ph: () => (/* binding */ useRoutesImpl),
/* harmony export */   sp: () => (/* binding */ DataRouterContext),
/* harmony export */   sv: () => (/* binding */ Outlet),
/* harmony export */   wE: () => (/* binding */ mapRouteProperties),
/* harmony export */   x$: () => (/* binding */ useResolvedPath),
/* harmony export */   zy: () => (/* binding */ useLocation)
/* harmony export */ });
/* unused harmony exports Await, MemoryRouter, Route, RouterProvider, Routes, UNSAFE_LocationContext, UNSAFE_RouteContext, UNSAFE_useRouteId, createMemoryRouter, createRoutesFromChildren, createRoutesFromElements, renderMatches, useActionData, useAsyncError, useAsyncValue, useBlocker, useInRouterContext, useLoaderData, useMatch, useMatches, useNavigation, useNavigationType, useOutlet, useOutletContext, useRevalidator, useRouteError, useRouteLoaderData, useRoutes */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6540);
/* harmony import */ var _remix_run_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5588);
/**
 * React Router v6.30.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */




function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

// Create react-specific types from the agnostic types in @remix-run/router to
// export from react-router
const DataRouterContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
if (false) // removed by dead control flow
{}
const DataRouterStateContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
if (false) // removed by dead control flow
{}
const AwaitContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
if (false) // removed by dead control flow
{}

/**
 * A Navigator is a "location changer"; it's how you get to different locations.
 *
 * Every history instance conforms to the Navigator interface, but the
 * distinction is useful primarily when it comes to the low-level `<Router>` API
 * where both the location and a navigator must be provided separately in order
 * to avoid "tearing" that may occur in a suspense-enabled app if the action
 * and/or location were to be read directly from the history instance.
 */

const NavigationContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
if (false) // removed by dead control flow
{}
const LocationContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
if (false) // removed by dead control flow
{}
const RouteContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext({
  outlet: null,
  matches: [],
  isDataRoute: false
});
if (false) // removed by dead control flow
{}
const RouteErrorContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);
if (false) // removed by dead control flow
{}

/**
 * Returns the full href for the given "to" value. This is useful for building
 * custom links that are also accessible and preserve right-click behavior.
 *
 * @see https://reactrouter.com/v6/hooks/use-href
 */
function useHref(to, _temp) {
  let {
    relative
  } = _temp === void 0 ? {} : _temp;
  !useInRouterContext() ?  false ? 0 : (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .UNSAFE_invariant */ .Oi)(false) : void 0;
  let {
    basename,
    navigator
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
  let {
    hash,
    pathname,
    search
  } = useResolvedPath(to, {
    relative
  });
  let joinedPathname = pathname;

  // If we're operating within a basename, prepend it to the pathname prior
  // to creating the href.  If this is a root navigation, then just use the raw
  // basename which allows the basename to have full control over the presence
  // of a trailing slash on root links
  if (basename !== "/") {
    joinedPathname = pathname === "/" ? basename : (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .joinPaths */ .HS)([basename, pathname]);
  }
  return navigator.createHref({
    pathname: joinedPathname,
    search,
    hash
  });
}

/**
 * Returns true if this component is a descendant of a `<Router>`.
 *
 * @see https://reactrouter.com/v6/hooks/use-in-router-context
 */
function useInRouterContext() {
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(LocationContext) != null;
}

/**
 * Returns the current location object, which represents the current URL in web
 * browsers.
 *
 * Note: If you're using this it may mean you're doing some of your own
 * "routing" in your app, and we'd like to know what your use case is. We may
 * be able to provide something higher-level to better suit your needs.
 *
 * @see https://reactrouter.com/v6/hooks/use-location
 */
function useLocation() {
  !useInRouterContext() ?  false ? 0 : (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .UNSAFE_invariant */ .Oi)(false) : void 0;
  return react__WEBPACK_IMPORTED_MODULE_0__.useContext(LocationContext).location;
}

/**
 * Returns the current navigation action which describes how the router came to
 * the current location, either by a pop, push, or replace on the history stack.
 *
 * @see https://reactrouter.com/v6/hooks/use-navigation-type
 */
function useNavigationType() {
  return React.useContext(LocationContext).navigationType;
}

/**
 * Returns a PathMatch object if the given pattern matches the current URL.
 * This is useful for components that need to know "active" state, e.g.
 * `<NavLink>`.
 *
 * @see https://reactrouter.com/v6/hooks/use-match
 */
function useMatch(pattern) {
  !useInRouterContext() ?  false ? 0 : UNSAFE_invariant(false) : void 0;
  let {
    pathname
  } = useLocation();
  return React.useMemo(() => matchPath(pattern, UNSAFE_decodePath(pathname)), [pathname, pattern]);
}

/**
 * The interface for the navigate() function returned from useNavigate().
 */

const navigateEffectWarning = (/* unused pure expression or super */ null && ("You should call navigate() in a React.useEffect(), not when " + "your component is first rendered."));

// Mute warnings for calls to useNavigate in SSR environments
function useIsomorphicLayoutEffect(cb) {
  let isStatic = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext).static;
  if (!isStatic) {
    // We should be able to get rid of this once react 18.3 is released
    // See: https://github.com/facebook/react/pull/26395
    // eslint-disable-next-line react-hooks/rules-of-hooks
    react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(cb);
  }
}

/**
 * Returns an imperative method for changing the location. Used by `<Link>`s, but
 * may also be used by other elements to change the location.
 *
 * @see https://reactrouter.com/v6/hooks/use-navigate
 */
function useNavigate() {
  let {
    isDataRoute
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  // Conditional usage is OK here because the usage of a data router is static
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
  !useInRouterContext() ?  false ? 0 : (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .UNSAFE_invariant */ .Oi)(false) : void 0;
  let dataRouterContext = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DataRouterContext);
  let {
    basename,
    future,
    navigator
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
  let {
    matches
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify((0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .UNSAFE_getResolveToMatches */ .yD)(matches, future.v7_relativeSplatPath));
  let activeRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (to, options) {
    if (options === void 0) {
      options = {};
    }
     false ? 0 : void 0;

    // Short circuit here since if this happens on first render the navigate
    // is useless because we haven't wired up our history listener yet
    if (!activeRef.current) return;
    if (typeof to === "number") {
      navigator.go(to);
      return;
    }
    let path = (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .resolveTo */ .Gh)(to, JSON.parse(routePathnamesJson), locationPathname, options.relative === "path");

    // If we're operating within a basename, prepend it to the pathname prior
    // to handing off to history (but only if we're not in a data router,
    // otherwise it'll prepend the basename inside of the router).
    // If this is a root navigation, then we navigate to the raw basename
    // which allows the basename to have full control over the presence of a
    // trailing slash on root links
    if (dataRouterContext == null && basename !== "/") {
      path.pathname = path.pathname === "/" ? basename : (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .joinPaths */ .HS)([basename, path.pathname]);
    }
    (!!options.replace ? navigator.replace : navigator.push)(path, options.state, options);
  }, [basename, navigator, routePathnamesJson, locationPathname, dataRouterContext]);
  return navigate;
}
const OutletContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createContext(null);

/**
 * Returns the context (if provided) for the child route at this level of the route
 * hierarchy.
 * @see https://reactrouter.com/v6/hooks/use-outlet-context
 */
function useOutletContext() {
  return React.useContext(OutletContext);
}

/**
 * Returns the element for the child route at this level of the route
 * hierarchy. Used internally by `<Outlet>` to render child routes.
 *
 * @see https://reactrouter.com/v6/hooks/use-outlet
 */
function useOutlet(context) {
  let outlet = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext).outlet;
  if (outlet) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(OutletContext.Provider, {
      value: context
    }, outlet);
  }
  return outlet;
}

/**
 * Returns an object of key/value pairs of the dynamic params from the current
 * URL that were matched by the route path.
 *
 * @see https://reactrouter.com/v6/hooks/use-params
 */
function useParams() {
  let {
    matches
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  let routeMatch = matches[matches.length - 1];
  return routeMatch ? routeMatch.params : {};
}

/**
 * Resolves the pathname of the given `to` value against the current location.
 *
 * @see https://reactrouter.com/v6/hooks/use-resolved-path
 */
function useResolvedPath(to, _temp2) {
  let {
    relative
  } = _temp2 === void 0 ? {} : _temp2;
  let {
    future
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
  let {
    matches
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify((0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .UNSAFE_getResolveToMatches */ .yD)(matches, future.v7_relativeSplatPath));
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .resolveTo */ .Gh)(to, JSON.parse(routePathnamesJson), locationPathname, relative === "path"), [to, routePathnamesJson, locationPathname, relative]);
}

/**
 * Returns the element of the route that matched the current location, prepared
 * with the correct context to render the remainder of the route tree. Route
 * elements in the tree must render an `<Outlet>` to render their child route's
 * element.
 *
 * @see https://reactrouter.com/v6/hooks/use-routes
 */
function useRoutes(routes, locationArg) {
  return useRoutesImpl(routes, locationArg);
}

// Internal implementation with accept optional param for RouterProvider usage
function useRoutesImpl(routes, locationArg, dataRouterState, future) {
  !useInRouterContext() ?  false ? 0 : (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .UNSAFE_invariant */ .Oi)(false) : void 0;
  let {
    navigator
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
  let {
    matches: parentMatches
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  let parentPathname = routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  let parentRoute = routeMatch && routeMatch.route;
  if (false) // removed by dead control flow
{}
  let locationFromContext = useLocation();
  let location;
  if (locationArg) {
    var _parsedLocationArg$pa;
    let parsedLocationArg = typeof locationArg === "string" ? (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .parsePath */ .Rr)(locationArg) : locationArg;
    !(parentPathnameBase === "/" || ((_parsedLocationArg$pa = parsedLocationArg.pathname) == null ? void 0 : _parsedLocationArg$pa.startsWith(parentPathnameBase))) ?  false ? 0 : (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .UNSAFE_invariant */ .Oi)(false) : void 0;
    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }
  let pathname = location.pathname || "/";
  let remainingPathname = pathname;
  if (parentPathnameBase !== "/") {
    // Determine the remaining pathname by removing the # of URL segments the
    // parentPathnameBase has, instead of removing based on character count.
    // This is because we can't guarantee that incoming/outgoing encodings/
    // decodings will match exactly.
    // We decode paths before matching on a per-segment basis with
    // decodeURIComponent(), but we re-encode pathnames via `new URL()` so they
    // match what `window.location.pathname` would reflect.  Those don't 100%
    // align when it comes to encoded URI characters such as % and &.
    //
    // So we may end up with:
    //   pathname:           "/descendant/a%25b/match"
    //   parentPathnameBase: "/descendant/a%b"
    //
    // And the direct substring removal approach won't work :/
    let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
    let segments = pathname.replace(/^\//, "").split("/");
    remainingPathname = "/" + segments.slice(parentSegments.length).join("/");
  }
  let matches = (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .matchRoutes */ .ue)(routes, {
    pathname: remainingPathname
  });
  if (false) // removed by dead control flow
{}
  let renderedMatches = _renderMatches(matches && matches.map(match => Object.assign({}, match, {
    params: Object.assign({}, parentParams, match.params),
    pathname: (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .joinPaths */ .HS)([parentPathnameBase,
    // Re-encode pathnames that were decoded inside matchRoutes
    navigator.encodeLocation ? navigator.encodeLocation(match.pathname).pathname : match.pathname]),
    pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .joinPaths */ .HS)([parentPathnameBase,
    // Re-encode pathnames that were decoded inside matchRoutes
    navigator.encodeLocation ? navigator.encodeLocation(match.pathnameBase).pathname : match.pathnameBase])
  })), parentMatches, dataRouterState, future);

  // When a user passes in a `locationArg`, the associated routes need to
  // be wrapped in a new `LocationContext.Provider` in order for `useLocation`
  // to use the scoped location instead of the global location.
  if (locationArg && renderedMatches) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(LocationContext.Provider, {
      value: {
        location: _extends({
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default"
        }, location),
        navigationType: _remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .Action */ .rc.Pop
      }
    }, renderedMatches);
  }
  return renderedMatches;
}
function DefaultErrorComponent() {
  let error = useRouteError();
  let message = (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .isRouteErrorResponse */ .pX)(error) ? error.status + " " + error.statusText : error instanceof Error ? error.message : JSON.stringify(error);
  let stack = error instanceof Error ? error.stack : null;
  let lightgrey = "rgba(200,200,200, 0.5)";
  let preStyles = {
    padding: "0.5rem",
    backgroundColor: lightgrey
  };
  let codeStyles = {
    padding: "2px 4px",
    backgroundColor: lightgrey
  };
  let devInfo = null;
  if (false) // removed by dead control flow
{}
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("h2", null, "Unexpected Application Error!"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", {
    style: {
      fontStyle: "italic"
    }
  }, message), stack ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement("pre", {
    style: preStyles
  }, stack) : null, devInfo);
}
const defaultErrorElement = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(DefaultErrorComponent, null);
class RenderErrorBoundary extends react__WEBPACK_IMPORTED_MODULE_0__.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      revalidation: props.revalidation,
      error: props.error
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error: error
    };
  }
  static getDerivedStateFromProps(props, state) {
    // When we get into an error state, the user will likely click "back" to the
    // previous page that didn't have an error. Because this wraps the entire
    // application, that will have no effect--the error page continues to display.
    // This gives us a mechanism to recover from the error when the location changes.
    //
    // Whether we're in an error state or not, we update the location in state
    // so that when we are in an error state, it gets reset when a new location
    // comes in and the user recovers from the error.
    if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
      return {
        error: props.error,
        location: props.location,
        revalidation: props.revalidation
      };
    }

    // If we're not changing locations, preserve the location but still surface
    // any new errors that may come through. We retain the existing error, we do
    // this because the error provided from the app state may be cleared without
    // the location changing.
    return {
      error: props.error !== undefined ? props.error : state.error,
      location: state.location,
      revalidation: props.revalidation || state.revalidation
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React Router caught the following error during render", error, errorInfo);
  }
  render() {
    return this.state.error !== undefined ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(RouteContext.Provider, {
      value: this.props.routeContext
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(RouteErrorContext.Provider, {
      value: this.state.error,
      children: this.props.component
    })) : this.props.children;
  }
}
function RenderedRoute(_ref) {
  let {
    routeContext,
    match,
    children
  } = _ref;
  let dataRouterContext = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DataRouterContext);

  // Track how deep we got in our render pass to emulate SSR componentDidCatch
  // in a DataStaticRouter
  if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) {
    dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(RouteContext.Provider, {
    value: routeContext
  }, children);
}
function _renderMatches(matches, parentMatches, dataRouterState, future) {
  var _dataRouterState;
  if (parentMatches === void 0) {
    parentMatches = [];
  }
  if (dataRouterState === void 0) {
    dataRouterState = null;
  }
  if (future === void 0) {
    future = null;
  }
  if (matches == null) {
    var _future;
    if (!dataRouterState) {
      return null;
    }
    if (dataRouterState.errors) {
      // Don't bail if we have data router errors so we can render them in the
      // boundary.  Use the pre-matched (or shimmed) matches
      matches = dataRouterState.matches;
    } else if ((_future = future) != null && _future.v7_partialHydration && parentMatches.length === 0 && !dataRouterState.initialized && dataRouterState.matches.length > 0) {
      // Don't bail if we're initializing with partial hydration and we have
      // router matches.  That means we're actively running `patchRoutesOnNavigation`
      // so we should render down the partial matches to the appropriate
      // `HydrateFallback`.  We only do this if `parentMatches` is empty so it
      // only impacts the root matches for `RouterProvider` and no descendant
      // `<Routes>`
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches;

  // If we have data errors, trim matches to the highest error boundary
  let errors = (_dataRouterState = dataRouterState) == null ? void 0 : _dataRouterState.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex(m => m.route.id && (errors == null ? void 0 : errors[m.route.id]) !== undefined);
    !(errorIndex >= 0) ?  false ? 0 : (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .UNSAFE_invariant */ .Oi)(false) : void 0;
    renderedMatches = renderedMatches.slice(0, Math.min(renderedMatches.length, errorIndex + 1));
  }

  // If we're in a partial hydration mode, detect if we need to render down to
  // a given HydrateFallback while we load the rest of the hydration data
  let renderFallback = false;
  let fallbackIndex = -1;
  if (dataRouterState && future && future.v7_partialHydration) {
    for (let i = 0; i < renderedMatches.length; i++) {
      let match = renderedMatches[i];
      // Track the deepest fallback up until the first route without data
      if (match.route.HydrateFallback || match.route.hydrateFallbackElement) {
        fallbackIndex = i;
      }
      if (match.route.id) {
        let {
          loaderData,
          errors
        } = dataRouterState;
        let needsToRunLoader = match.route.loader && loaderData[match.route.id] === undefined && (!errors || errors[match.route.id] === undefined);
        if (match.route.lazy || needsToRunLoader) {
          // We found the first route that's not ready to render (waiting on
          // lazy, or has a loader that hasn't run yet).  Flag that we need to
          // render a fallback and render up until the appropriate fallback
          renderFallback = true;
          if (fallbackIndex >= 0) {
            renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
          } else {
            renderedMatches = [renderedMatches[0]];
          }
          break;
        }
      }
    }
  }
  return renderedMatches.reduceRight((outlet, match, index) => {
    // Only data routers handle errors/fallbacks
    let error;
    let shouldRenderHydrateFallback = false;
    let errorElement = null;
    let hydrateFallbackElement = null;
    if (dataRouterState) {
      error = errors && match.route.id ? errors[match.route.id] : undefined;
      errorElement = match.route.errorElement || defaultErrorElement;
      if (renderFallback) {
        if (fallbackIndex < 0 && index === 0) {
          warningOnce("route-fallback", false, "No `HydrateFallback` element provided to render during initial hydration");
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = null;
        } else if (fallbackIndex === index) {
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = match.route.hydrateFallbackElement || null;
        }
      }
    }
    let matches = parentMatches.concat(renderedMatches.slice(0, index + 1));
    let getChildren = () => {
      let children;
      if (error) {
        children = errorElement;
      } else if (shouldRenderHydrateFallback) {
        children = hydrateFallbackElement;
      } else if (match.route.Component) {
        // Note: This is a de-optimized path since React won't re-use the
        // ReactElement since it's identity changes with each new
        // React.createElement call.  We keep this so folks can use
        // `<Route Component={...}>` in `<Routes>` but generally `Component`
        // usage is only advised in `RouterProvider` when we can convert it to
        // `element` ahead of time.
        children = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(match.route.Component, null);
      } else if (match.route.element) {
        children = match.route.element;
      } else {
        children = outlet;
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(RenderedRoute, {
        match: match,
        routeContext: {
          outlet,
          matches,
          isDataRoute: dataRouterState != null
        },
        children: children
      });
    };
    // Only wrap in an error boundary within data router usages when we have an
    // ErrorBoundary/errorElement on this route.  Otherwise let it bubble up to
    // an ancestor ErrorBoundary/errorElement
    return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index === 0) ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(RenderErrorBoundary, {
      location: dataRouterState.location,
      revalidation: dataRouterState.revalidation,
      component: errorElement,
      error: error,
      children: getChildren(),
      routeContext: {
        outlet: null,
        matches,
        isDataRoute: true
      }
    }) : getChildren();
  }, null);
}
var DataRouterHook = /*#__PURE__*/function (DataRouterHook) {
  DataRouterHook["UseBlocker"] = "useBlocker";
  DataRouterHook["UseRevalidator"] = "useRevalidator";
  DataRouterHook["UseNavigateStable"] = "useNavigate";
  return DataRouterHook;
}(DataRouterHook || {});
var DataRouterStateHook = /*#__PURE__*/function (DataRouterStateHook) {
  DataRouterStateHook["UseBlocker"] = "useBlocker";
  DataRouterStateHook["UseLoaderData"] = "useLoaderData";
  DataRouterStateHook["UseActionData"] = "useActionData";
  DataRouterStateHook["UseRouteError"] = "useRouteError";
  DataRouterStateHook["UseNavigation"] = "useNavigation";
  DataRouterStateHook["UseRouteLoaderData"] = "useRouteLoaderData";
  DataRouterStateHook["UseMatches"] = "useMatches";
  DataRouterStateHook["UseRevalidator"] = "useRevalidator";
  DataRouterStateHook["UseNavigateStable"] = "useNavigate";
  DataRouterStateHook["UseRouteId"] = "useRouteId";
  return DataRouterStateHook;
}(DataRouterStateHook || {});
function getDataRouterConsoleError(hookName) {
  return hookName + " must be used within a data router.  See https://reactrouter.com/v6/routers/picking-a-router.";
}
function useDataRouterContext(hookName) {
  let ctx = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DataRouterContext);
  !ctx ?  false ? 0 : (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .UNSAFE_invariant */ .Oi)(false) : void 0;
  return ctx;
}
function useDataRouterState(hookName) {
  let state = react__WEBPACK_IMPORTED_MODULE_0__.useContext(DataRouterStateContext);
  !state ?  false ? 0 : (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .UNSAFE_invariant */ .Oi)(false) : void 0;
  return state;
}
function useRouteContext(hookName) {
  let route = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  !route ?  false ? 0 : (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .UNSAFE_invariant */ .Oi)(false) : void 0;
  return route;
}

// Internal version with hookName-aware debugging
function useCurrentRouteId(hookName) {
  let route = useRouteContext(hookName);
  let thisRoute = route.matches[route.matches.length - 1];
  !thisRoute.route.id ?  false ? 0 : (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .UNSAFE_invariant */ .Oi)(false) : void 0;
  return thisRoute.route.id;
}

/**
 * Returns the ID for the nearest contextual route
 */
function useRouteId() {
  return useCurrentRouteId(DataRouterStateHook.UseRouteId);
}

/**
 * Returns the current navigation, defaulting to an "idle" navigation when
 * no navigation is in progress
 */
function useNavigation() {
  let state = useDataRouterState(DataRouterStateHook.UseNavigation);
  return state.navigation;
}

/**
 * Returns a revalidate function for manually triggering revalidation, as well
 * as the current state of any manual revalidations
 */
function useRevalidator() {
  let dataRouterContext = useDataRouterContext(DataRouterHook.UseRevalidator);
  let state = useDataRouterState(DataRouterStateHook.UseRevalidator);
  return React.useMemo(() => ({
    revalidate: dataRouterContext.router.revalidate,
    state: state.revalidation
  }), [dataRouterContext.router.revalidate, state.revalidation]);
}

/**
 * Returns the active route matches, useful for accessing loaderData for
 * parent/child routes or the route "handle" property
 */
function useMatches() {
  let {
    matches,
    loaderData
  } = useDataRouterState(DataRouterStateHook.UseMatches);
  return React.useMemo(() => matches.map(m => UNSAFE_convertRouteMatchToUiMatch(m, loaderData)), [matches, loaderData]);
}

/**
 * Returns the loader data for the nearest ancestor Route loader
 */
function useLoaderData() {
  let state = useDataRouterState(DataRouterStateHook.UseLoaderData);
  let routeId = useCurrentRouteId(DataRouterStateHook.UseLoaderData);
  if (state.errors && state.errors[routeId] != null) {
    console.error("You cannot `useLoaderData` in an errorElement (routeId: " + routeId + ")");
    return undefined;
  }
  return state.loaderData[routeId];
}

/**
 * Returns the loaderData for the given routeId
 */
function useRouteLoaderData(routeId) {
  let state = useDataRouterState(DataRouterStateHook.UseRouteLoaderData);
  return state.loaderData[routeId];
}

/**
 * Returns the action data for the nearest ancestor Route action
 */
function useActionData() {
  let state = useDataRouterState(DataRouterStateHook.UseActionData);
  let routeId = useCurrentRouteId(DataRouterStateHook.UseLoaderData);
  return state.actionData ? state.actionData[routeId] : undefined;
}

/**
 * Returns the nearest ancestor Route error, which could be a loader/action
 * error or a render error.  This is intended to be called from your
 * ErrorBoundary/errorElement to display a proper error message.
 */
function useRouteError() {
  var _state$errors;
  let error = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteErrorContext);
  let state = useDataRouterState(DataRouterStateHook.UseRouteError);
  let routeId = useCurrentRouteId(DataRouterStateHook.UseRouteError);

  // If this was a render error, we put it in a RouteError context inside
  // of RenderErrorBoundary
  if (error !== undefined) {
    return error;
  }

  // Otherwise look for errors from our data router state
  return (_state$errors = state.errors) == null ? void 0 : _state$errors[routeId];
}

/**
 * Returns the happy-path data from the nearest ancestor `<Await />` value
 */
function useAsyncValue() {
  let value = React.useContext(AwaitContext);
  return value == null ? void 0 : value._data;
}

/**
 * Returns the error from the nearest ancestor `<Await />` value
 */
function useAsyncError() {
  let value = React.useContext(AwaitContext);
  return value == null ? void 0 : value._error;
}
let blockerId = 0;

/**
 * Allow the application to block navigations within the SPA and present the
 * user a confirmation dialog to confirm the navigation.  Mostly used to avoid
 * using half-filled form data.  This does not handle hard-reloads or
 * cross-origin navigations.
 */
function useBlocker(shouldBlock) {
  let {
    router,
    basename
  } = useDataRouterContext(DataRouterHook.UseBlocker);
  let state = useDataRouterState(DataRouterStateHook.UseBlocker);
  let [blockerKey, setBlockerKey] = React.useState("");
  let blockerFunction = React.useCallback(arg => {
    if (typeof shouldBlock !== "function") {
      return !!shouldBlock;
    }
    if (basename === "/") {
      return shouldBlock(arg);
    }

    // If they provided us a function and we've got an active basename, strip
    // it from the locations we expose to the user to match the behavior of
    // useLocation
    let {
      currentLocation,
      nextLocation,
      historyAction
    } = arg;
    return shouldBlock({
      currentLocation: _extends({}, currentLocation, {
        pathname: stripBasename(currentLocation.pathname, basename) || currentLocation.pathname
      }),
      nextLocation: _extends({}, nextLocation, {
        pathname: stripBasename(nextLocation.pathname, basename) || nextLocation.pathname
      }),
      historyAction
    });
  }, [basename, shouldBlock]);

  // This effect is in charge of blocker key assignment and deletion (which is
  // tightly coupled to the key)
  React.useEffect(() => {
    let key = String(++blockerId);
    setBlockerKey(key);
    return () => router.deleteBlocker(key);
  }, [router]);

  // This effect handles assigning the blockerFunction.  This is to handle
  // unstable blocker function identities, and happens only after the prior
  // effect so we don't get an orphaned blockerFunction in the router with a
  // key of "".  Until then we just have the IDLE_BLOCKER.
  React.useEffect(() => {
    if (blockerKey !== "") {
      router.getBlocker(blockerKey, blockerFunction);
    }
  }, [router, blockerKey, blockerFunction]);

  // Prefer the blocker from `state` not `router.state` since DataRouterContext
  // is memoized so this ensures we update on blocker state updates
  return blockerKey && state.blockers.has(blockerKey) ? state.blockers.get(blockerKey) : IDLE_BLOCKER;
}

/**
 * Stable version of useNavigate that is used when we are in the context of
 * a RouterProvider.
 */
function useNavigateStable() {
  let {
    router
  } = useDataRouterContext(DataRouterHook.UseNavigateStable);
  let id = useCurrentRouteId(DataRouterStateHook.UseNavigateStable);
  let activeRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (to, options) {
    if (options === void 0) {
      options = {};
    }
     false ? 0 : void 0;

    // Short circuit here since if this happens on first render the navigate
    // is useless because we haven't wired up our router subscriber yet
    if (!activeRef.current) return;
    if (typeof to === "number") {
      router.navigate(to);
    } else {
      router.navigate(to, _extends({
        fromRouteId: id
      }, options));
    }
  }, [router, id]);
  return navigate;
}
const alreadyWarned$1 = {};
function warningOnce(key, cond, message) {
  if (!cond && !alreadyWarned$1[key]) {
    alreadyWarned$1[key] = true;
     false ? 0 : void 0;
  }
}

const alreadyWarned = {};
function warnOnce(key, message) {
  if (false) // removed by dead control flow
{}
}
const logDeprecation = (flag, msg, link) => warnOnce(flag, "\u26A0\uFE0F React Router Future Flag Warning: " + msg + ". " + ("You can use the `" + flag + "` future flag to opt-in early. ") + ("For more information, see " + link + "."));
function logV6DeprecationWarnings(renderFuture, routerFuture) {
  if ((renderFuture == null ? void 0 : renderFuture.v7_startTransition) === undefined) {
    logDeprecation("v7_startTransition", "React Router will begin wrapping state updates in `React.startTransition` in v7", "https://reactrouter.com/v6/upgrading/future#v7_starttransition");
  }
  if ((renderFuture == null ? void 0 : renderFuture.v7_relativeSplatPath) === undefined && (!routerFuture || routerFuture.v7_relativeSplatPath === undefined)) {
    logDeprecation("v7_relativeSplatPath", "Relative route resolution within Splat routes is changing in v7", "https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath");
  }
  if (routerFuture) {
    if (routerFuture.v7_fetcherPersist === undefined) {
      logDeprecation("v7_fetcherPersist", "The persistence behavior of fetchers is changing in v7", "https://reactrouter.com/v6/upgrading/future#v7_fetcherpersist");
    }
    if (routerFuture.v7_normalizeFormMethod === undefined) {
      logDeprecation("v7_normalizeFormMethod", "Casing of `formMethod` fields is being normalized to uppercase in v7", "https://reactrouter.com/v6/upgrading/future#v7_normalizeformmethod");
    }
    if (routerFuture.v7_partialHydration === undefined) {
      logDeprecation("v7_partialHydration", "`RouterProvider` hydration behavior is changing in v7", "https://reactrouter.com/v6/upgrading/future#v7_partialhydration");
    }
    if (routerFuture.v7_skipActionErrorRevalidation === undefined) {
      logDeprecation("v7_skipActionErrorRevalidation", "The revalidation behavior after 4xx/5xx `action` responses is changing in v7", "https://reactrouter.com/v6/upgrading/future#v7_skipactionerrorrevalidation");
    }
  }
}

/**
  Webpack + React 17 fails to compile on any of the following because webpack
  complains that `startTransition` doesn't exist in `React`:
  * import { startTransition } from "react"
  * import * as React from from "react";
    "startTransition" in React ? React.startTransition(() => setState()) : setState()
  * import * as React from from "react";
    "startTransition" in React ? React["startTransition"](() => setState()) : setState()

  Moving it to a constant such as the following solves the Webpack/React 17 issue:
  * import * as React from from "react";
    const START_TRANSITION = "startTransition";
    START_TRANSITION in React ? React[START_TRANSITION](() => setState()) : setState()

  However, that introduces webpack/terser minification issues in production builds
  in React 18 where minification/obfuscation ends up removing the call of
  React.startTransition entirely from the first half of the ternary.  Grabbing
  this exported reference once up front resolves that issue.

  See https://github.com/remix-run/react-router/issues/10579
*/
const START_TRANSITION = "startTransition";
const startTransitionImpl = /*#__PURE__*/ (react__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (react__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(react__WEBPACK_IMPORTED_MODULE_0__, 2)))[START_TRANSITION];

/**
 * Given a Remix Router instance, render the appropriate UI
 */
function RouterProvider(_ref) {
  let {
    fallbackElement,
    router,
    future
  } = _ref;
  let [state, setStateImpl] = React.useState(router.state);
  let {
    v7_startTransition
  } = future || {};
  let setState = React.useCallback(newState => {
    if (v7_startTransition && startTransitionImpl) {
      startTransitionImpl(() => setStateImpl(newState));
    } else {
      setStateImpl(newState);
    }
  }, [setStateImpl, v7_startTransition]);

  // Need to use a layout effect here so we are subscribed early enough to
  // pick up on any render-driven redirects/navigations (useEffect/<Navigate>)
  React.useLayoutEffect(() => router.subscribe(setState), [router, setState]);
  React.useEffect(() => {
     false ? 0 : void 0;
    // Only log this once on initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let navigator = React.useMemo(() => {
    return {
      createHref: router.createHref,
      encodeLocation: router.encodeLocation,
      go: n => router.navigate(n),
      push: (to, state, opts) => router.navigate(to, {
        state,
        preventScrollReset: opts == null ? void 0 : opts.preventScrollReset
      }),
      replace: (to, state, opts) => router.navigate(to, {
        replace: true,
        state,
        preventScrollReset: opts == null ? void 0 : opts.preventScrollReset
      })
    };
  }, [router]);
  let basename = router.basename || "/";
  let dataRouterContext = React.useMemo(() => ({
    router,
    navigator,
    static: false,
    basename
  }), [router, navigator, basename]);
  React.useEffect(() => logV6DeprecationWarnings(future, router.future), [router, future]);

  // The fragment and {null} here are important!  We need them to keep React 18's
  // useId happy when we are server-rendering since we may have a <script> here
  // containing the hydrated server-side staticContext (from StaticRouterProvider).
  // useId relies on the component tree structure to generate deterministic id's
  // so we need to ensure it remains the same on the client even though
  // we don't need the <script> tag
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DataRouterContext.Provider, {
    value: dataRouterContext
  }, /*#__PURE__*/React.createElement(DataRouterStateContext.Provider, {
    value: state
  }, /*#__PURE__*/React.createElement(Router, {
    basename: basename,
    location: state.location,
    navigationType: state.historyAction,
    navigator: navigator,
    future: {
      v7_relativeSplatPath: router.future.v7_relativeSplatPath
    }
  }, state.initialized || router.future.v7_partialHydration ? /*#__PURE__*/React.createElement(DataRoutes, {
    routes: router.routes,
    future: router.future,
    state: state
  }) : fallbackElement))), null);
}
function DataRoutes(_ref2) {
  let {
    routes,
    future,
    state
  } = _ref2;
  return useRoutesImpl(routes, undefined, state, future);
}
/**
 * A `<Router>` that stores all entries in memory.
 *
 * @see https://reactrouter.com/v6/router-components/memory-router
 */
function MemoryRouter(_ref3) {
  let {
    basename,
    children,
    initialEntries,
    initialIndex,
    future
  } = _ref3;
  let historyRef = React.useRef();
  if (historyRef.current == null) {
    historyRef.current = createMemoryHistory({
      initialEntries,
      initialIndex,
      v5Compat: true
    });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = React.useState({
    action: history.action,
    location: history.location
  });
  let {
    v7_startTransition
  } = future || {};
  let setState = React.useCallback(newState => {
    v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
  }, [setStateImpl, v7_startTransition]);
  React.useLayoutEffect(() => history.listen(setState), [history, setState]);
  React.useEffect(() => logV6DeprecationWarnings(future), [future]);
  return /*#__PURE__*/React.createElement(Router, {
    basename: basename,
    children: children,
    location: state.location,
    navigationType: state.action,
    navigator: history,
    future: future
  });
}
/**
 * Changes the current location.
 *
 * Note: This API is mostly useful in React.Component subclasses that are not
 * able to use hooks. In functional components, we recommend you use the
 * `useNavigate` hook instead.
 *
 * @see https://reactrouter.com/v6/components/navigate
 */
function Navigate(_ref4) {
  let {
    to,
    replace,
    state,
    relative
  } = _ref4;
  !useInRouterContext() ?  false ? 0 : (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .UNSAFE_invariant */ .Oi)(false) : void 0;
  let {
    future,
    static: isStatic
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(NavigationContext);
   false ? 0 : void 0;
  let {
    matches
  } = react__WEBPACK_IMPORTED_MODULE_0__.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let navigate = useNavigate();

  // Resolve the path outside of the effect so that when effects run twice in
  // StrictMode they navigate to the same place
  let path = (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .resolveTo */ .Gh)(to, (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .UNSAFE_getResolveToMatches */ .yD)(matches, future.v7_relativeSplatPath), locationPathname, relative === "path");
  let jsonPath = JSON.stringify(path);
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => navigate(JSON.parse(jsonPath), {
    replace,
    state,
    relative
  }), [navigate, jsonPath, relative, replace, state]);
  return null;
}
/**
 * Renders the child route's element, if there is one.
 *
 * @see https://reactrouter.com/v6/components/outlet
 */
function Outlet(props) {
  return useOutlet(props.context);
}
/**
 * Declares an element that should be rendered at a certain URL path.
 *
 * @see https://reactrouter.com/v6/components/route
 */
function Route(_props) {
   false ? 0 : UNSAFE_invariant(false) ;
}
/**
 * Provides location context for the rest of the app.
 *
 * Note: You usually won't render a `<Router>` directly. Instead, you'll render a
 * router that is more specific to your environment such as a `<BrowserRouter>`
 * in web browsers or a `<StaticRouter>` for server rendering.
 *
 * @see https://reactrouter.com/v6/router-components/router
 */
function Router(_ref5) {
  let {
    basename: basenameProp = "/",
    children = null,
    location: locationProp,
    navigationType = _remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .Action */ .rc.Pop,
    navigator,
    static: staticProp = false,
    future
  } = _ref5;
  !!useInRouterContext() ?  false ? 0 : (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .UNSAFE_invariant */ .Oi)(false) : void 0;

  // Preserve trailing slashes on basename, so we can let the user control
  // the enforcement of trailing slashes throughout the app
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => ({
    basename,
    navigator,
    static: staticProp,
    future: _extends({
      v7_relativeSplatPath: false
    }, future)
  }), [basename, future, navigator, staticProp]);
  if (typeof locationProp === "string") {
    locationProp = (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .parsePath */ .Rr)(locationProp);
  }
  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  let locationContext = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
    let trailingPathname = (0,_remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .stripBasename */ .pb)(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      location: {
        pathname: trailingPathname,
        search,
        hash,
        state,
        key
      },
      navigationType
    };
  }, [basename, pathname, search, hash, state, key, navigationType]);
   false ? 0 : void 0;
  if (locationContext == null) {
    return null;
  }
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(NavigationContext.Provider, {
    value: navigationContext
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(LocationContext.Provider, {
    children: children,
    value: locationContext
  }));
}
/**
 * A container for a nested tree of `<Route>` elements that renders the branch
 * that best matches the current location.
 *
 * @see https://reactrouter.com/v6/components/routes
 */
function Routes(_ref6) {
  let {
    children,
    location
  } = _ref6;
  return useRoutes(createRoutesFromChildren(children), location);
}
/**
 * Component to use for rendering lazily loaded data from returning defer()
 * in a loader function
 */
function Await(_ref7) {
  let {
    children,
    errorElement,
    resolve
  } = _ref7;
  return /*#__PURE__*/React.createElement(AwaitErrorBoundary, {
    resolve: resolve,
    errorElement: errorElement
  }, /*#__PURE__*/React.createElement(ResolveAwait, null, children));
}
var AwaitRenderStatus = /*#__PURE__*/function (AwaitRenderStatus) {
  AwaitRenderStatus[AwaitRenderStatus["pending"] = 0] = "pending";
  AwaitRenderStatus[AwaitRenderStatus["success"] = 1] = "success";
  AwaitRenderStatus[AwaitRenderStatus["error"] = 2] = "error";
  return AwaitRenderStatus;
}(AwaitRenderStatus || {});
const neverSettledPromise = new Promise(() => {});
class AwaitErrorBoundary extends react__WEBPACK_IMPORTED_MODULE_0__.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("<Await> caught the following error during render", error, errorInfo);
  }
  render() {
    let {
      children,
      errorElement,
      resolve
    } = this.props;
    let promise = null;
    let status = AwaitRenderStatus.pending;
    if (!(resolve instanceof Promise)) {
      // Didn't get a promise - provide as a resolved promise
      status = AwaitRenderStatus.success;
      promise = Promise.resolve();
      Object.defineProperty(promise, "_tracked", {
        get: () => true
      });
      Object.defineProperty(promise, "_data", {
        get: () => resolve
      });
    } else if (this.state.error) {
      // Caught a render error, provide it as a rejected promise
      status = AwaitRenderStatus.error;
      let renderError = this.state.error;
      promise = Promise.reject().catch(() => {}); // Avoid unhandled rejection warnings
      Object.defineProperty(promise, "_tracked", {
        get: () => true
      });
      Object.defineProperty(promise, "_error", {
        get: () => renderError
      });
    } else if (resolve._tracked) {
      // Already tracked promise - check contents
      promise = resolve;
      status = "_error" in promise ? AwaitRenderStatus.error : "_data" in promise ? AwaitRenderStatus.success : AwaitRenderStatus.pending;
    } else {
      // Raw (untracked) promise - track it
      status = AwaitRenderStatus.pending;
      Object.defineProperty(resolve, "_tracked", {
        get: () => true
      });
      promise = resolve.then(data => Object.defineProperty(resolve, "_data", {
        get: () => data
      }), error => Object.defineProperty(resolve, "_error", {
        get: () => error
      }));
    }
    if (status === AwaitRenderStatus.error && promise._error instanceof _remix_run_router__WEBPACK_IMPORTED_MODULE_1__/* .AbortedDeferredError */ .tH) {
      // Freeze the UI by throwing a never resolved promise
      throw neverSettledPromise;
    }
    if (status === AwaitRenderStatus.error && !errorElement) {
      // No errorElement, throw to the nearest route-level error boundary
      throw promise._error;
    }
    if (status === AwaitRenderStatus.error) {
      // Render via our errorElement
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(AwaitContext.Provider, {
        value: promise,
        children: errorElement
      });
    }
    if (status === AwaitRenderStatus.success) {
      // Render children with resolved value
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(AwaitContext.Provider, {
        value: promise,
        children: children
      });
    }

    // Throw to the suspense boundary
    throw promise;
  }
}

/**
 * @private
 * Indirection to leverage useAsyncValue for a render-prop API on `<Await>`
 */
function ResolveAwait(_ref8) {
  let {
    children
  } = _ref8;
  let data = useAsyncValue();
  let toRender = typeof children === "function" ? children(data) : children;
  return /*#__PURE__*/React.createElement(React.Fragment, null, toRender);
}

///////////////////////////////////////////////////////////////////////////////
// UTILS
///////////////////////////////////////////////////////////////////////////////

/**
 * Creates a route config from a React "children" object, which is usually
 * either a `<Route>` element or an array of them. Used internally by
 * `<Routes>` to create a route config from its children.
 *
 * @see https://reactrouter.com/v6/utils/create-routes-from-children
 */
function createRoutesFromChildren(children, parentPath) {
  if (parentPath === void 0) {
    parentPath = [];
  }
  let routes = [];
  React.Children.forEach(children, (element, index) => {
    if (! /*#__PURE__*/React.isValidElement(element)) {
      // Ignore non-elements. This allows people to more easily inline
      // conditionals in their route config.
      return;
    }
    let treePath = [...parentPath, index];
    if (element.type === React.Fragment) {
      // Transparently support React.Fragment and its children.
      routes.push.apply(routes, createRoutesFromChildren(element.props.children, treePath));
      return;
    }
    !(element.type === Route) ?  false ? 0 : UNSAFE_invariant(false) : void 0;
    !(!element.props.index || !element.props.children) ?  false ? 0 : UNSAFE_invariant(false) : void 0;
    let route = {
      id: element.props.id || treePath.join("-"),
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      Component: element.props.Component,
      index: element.props.index,
      path: element.props.path,
      loader: element.props.loader,
      action: element.props.action,
      errorElement: element.props.errorElement,
      ErrorBoundary: element.props.ErrorBoundary,
      hasErrorBoundary: element.props.ErrorBoundary != null || element.props.errorElement != null,
      shouldRevalidate: element.props.shouldRevalidate,
      handle: element.props.handle,
      lazy: element.props.lazy
    };
    if (element.props.children) {
      route.children = createRoutesFromChildren(element.props.children, treePath);
    }
    routes.push(route);
  });
  return routes;
}

/**
 * Renders the result of `matchRoutes()` into a React element.
 */
function renderMatches(matches) {
  return _renderMatches(matches);
}

function mapRouteProperties(route) {
  let updates = {
    // Note: this check also occurs in createRoutesFromChildren so update
    // there if you change this -- please and thank you!
    hasErrorBoundary: route.ErrorBoundary != null || route.errorElement != null
  };
  if (route.Component) {
    if (false) // removed by dead control flow
{}
    Object.assign(updates, {
      element: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(route.Component),
      Component: undefined
    });
  }
  if (route.HydrateFallback) {
    if (false) // removed by dead control flow
{}
    Object.assign(updates, {
      hydrateFallbackElement: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(route.HydrateFallback),
      HydrateFallback: undefined
    });
  }
  if (route.ErrorBoundary) {
    if (false) // removed by dead control flow
{}
    Object.assign(updates, {
      errorElement: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(route.ErrorBoundary),
      ErrorBoundary: undefined
    });
  }
  return updates;
}
function createMemoryRouter(routes, opts) {
  return createRouter({
    basename: opts == null ? void 0 : opts.basename,
    future: _extends({}, opts == null ? void 0 : opts.future, {
      v7_prependBasename: true
    }),
    history: createMemoryHistory({
      initialEntries: opts == null ? void 0 : opts.initialEntries,
      initialIndex: opts == null ? void 0 : opts.initialIndex
    }),
    hydrationData: opts == null ? void 0 : opts.hydrationData,
    routes,
    mapRouteProperties,
    dataStrategy: opts == null ? void 0 : opts.dataStrategy,
    patchRoutesOnNavigation: opts == null ? void 0 : opts.patchRoutesOnNavigation
  }).initialize();
}


//# sourceMappingURL=index.js.map


/***/ }),

/***/ 7778:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "63d02ea896a7406849b6.woff2";

/***/ }),

/***/ 7797:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "b7c27c60f848f2083f45.woff2";

/***/ }),

/***/ 7825:
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ 7855:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "cdb4dd5dc508fe6e7398.woff2";

/***/ }),

/***/ 7892:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "5d9bfcacc44f345662ff.woff2";

/***/ }),

/***/ 8090:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "eca1e21531598d5db58f.woff2";

/***/ }),

/***/ 8445:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Search)
/* harmony export */ });
/* unused harmony export __iconNode */
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9407);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("search", __iconNode);


//# sourceMappingURL=search.js.map


/***/ }),

/***/ 8697:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ X)
/* harmony export */ });
/* unused harmony export __iconNode */
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9407);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("x", __iconNode);


//# sourceMappingURL=x.js.map


/***/ }),

/***/ 8711:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "02426d017cf367236f56.woff";

/***/ }),

/***/ 8735:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "4cdf2b4e817dade3d4aa.woff2";

/***/ }),

/***/ 8765:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5072);
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7825);
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7659);
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5056);
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(540);
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1113);
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_600_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(3580);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_600_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A, options);




       /* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_600_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A && _css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_600_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A.locals ? _css_loader_dist_cjs_js_postcss_loader_dist_cjs_js_600_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A.locals : undefined);


/***/ }),

/***/ 8931:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ ExternalLink)
/* harmony export */ });
/* unused harmony export __iconNode */
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9407);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("external-link", __iconNode);


//# sourceMappingURL=external-link.js.map


/***/ }),

/***/ 9230:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Menu)
/* harmony export */ });
/* unused harmony export __iconNode */
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9407);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "M4 12h16", key: "1lakjw" }],
  ["path", { d: "M4 18h16", key: "19g7jn" }],
  ["path", { d: "M4 6h16", key: "1o0s65" }]
];
const Menu = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("menu", __iconNode);


//# sourceMappingURL=menu.js.map


/***/ }),

/***/ 9299:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "debd93e5ca5313a6d262.woff";

/***/ }),

/***/ 9407:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ createLucideIcon)
});

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
;// ./node_modules/lucide-react/dist/esm/shared/src/utils.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
};


//# sourceMappingURL=utils.js.map

;// ./node_modules/lucide-react/dist/esm/defaultAttributes.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};


//# sourceMappingURL=defaultAttributes.js.map

;// ./node_modules/lucide-react/dist/esm/Icon.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */





const Icon = (0,react.forwardRef)(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => (0,react.createElement)(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => (0,react.createElement)(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);


//# sourceMappingURL=Icon.js.map

;// ./node_modules/lucide-react/dist/esm/createLucideIcon.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */





const createLucideIcon = (iconName, iconNode) => {
  const Component = (0,react.forwardRef)(
    ({ className, ...props }, ref) => (0,react.createElement)(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};


//# sourceMappingURL=createLucideIcon.js.map


/***/ }),

/***/ 9436:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Bell)
/* harmony export */ });
/* unused harmony export __iconNode */
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9407);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
      key: "11g9vi"
    }
  ]
];
const Bell = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("bell", __iconNode);


//# sourceMappingURL=bell.js.map


/***/ }),

/***/ 9506:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "cceb6e3d4483c3136077.woff";

/***/ }),

/***/ 9549:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "44c9df135eec470b0ab6.woff2";

/***/ }),

/***/ 9839:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "6984cf5e8583fac83be3.woff2";

/***/ }),

/***/ 9844:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "062321ff8a8844520dc5.woff";

/***/ }),

/***/ 9982:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (true) {
  module.exports = __webpack_require__(7463);
} else // removed by dead control flow
{}


/***/ })

}]);
//# sourceMappingURL=4213.bundle.js.map