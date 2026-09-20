/**
 * Helpers shared by all fancyswitch widgets.
 *
 * Widget attributes come out of the vis editor as strings, so every value that is logically a boolean or a
 * number has to be coerced before use - the vis-1 widget set did that inline in every template, here it lives
 * in one place.
 */

/** A value that can be written to a state */
export type StateValue = string | number | boolean;

/** `true`, `'true'` and `1` are true; everything else is false */
export function isTrue(value: unknown): boolean {
    return value === true || value === 'true' || value === 1 || value === '1';
}

/** Parses a value that may be a number, a numeric string or empty. Returns `defaultValue` when it is not a number */
export function toNumber(value: unknown, defaultValue = 0): number {
    if (typeof value === 'number') {
        return isFinite(value) ? value : defaultValue;
    }
    if (typeof value !== 'string' || value === '') {
        return defaultValue;
    }
    const parsed = parseFloat(value.replace(',', '.'));
    return isFinite(parsed) ? parsed : defaultValue;
}

/**
 * The `valTrue` / `valFalse` settings of the vis-1 widgets.
 *
 * An empty field falls back to `1` respectively `0`, the texts `true` and `false` become booleans, a number
 * becomes a number, and everything else stays the text the user typed - `setValue` then writes exactly that.
 */
export function normalizeConfigured(value: unknown, fallback: 0 | 1): StateValue {
    if (value === null || value === undefined || value === '') {
        return fallback;
    }
    if (typeof value === 'boolean' || typeof value === 'number') {
        return value;
    }
    if (value === 'true') {
        return true;
    }
    if (value === 'false') {
        return false;
    }
    const parsed = parseFloat(value as string);
    // `'1'` has to become the number 1, but `'1 kWh'` must stay text
    return parsed.toString() === value ? parsed : (value as StateValue);
}

/**
 * Whether a state value counts as "on", with the rules of the vis-1 widget set.
 *
 * Everything that is not a boolean is turned into a number when it looks like one and is then on if it is
 * positive; a value whose text equals a textual `valTrue` is on as well, which is how `"ON"` / `"OFF"` states
 * work.
 *
 * A boolean is compared against `valTrue` loosely. The vis-1 widget compared it strictly, so a `true` never
 * matched the default `valTrue` of `1` and a boolean state stayed off forever - the only place where this
 * deliberately does not do what the original did.
 */
export function isOn(raw: unknown, valTrue: StateValue, valFalse: StateValue): boolean {
    let value: unknown = raw === null || raw === undefined ? valFalse : raw;

    if (value === 'true') {
        value = true;
    } else if (value === 'false') {
        value = false;
    }

    if (typeof value === 'boolean') {
        return value === configuredAsBoolean(valTrue);
    }

    if (typeof value === 'string') {
        // text that equals a textual `valTrue` is on - that is how `"ON"` / `"OFF"` states work
        if (value === valTrue) {
            return true;
        }
        const parsed = parseFloat(value);
        if (parsed.toString() === value) {
            value = parsed;
        }
    }

    return typeof value === 'number' && value > 0;
}

/** `valTrue` read as a boolean, so a boolean state has something to be compared against */
function configuredAsBoolean(value: StateValue): boolean {
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'number') {
        return value > 0;
    }
    const parsed = parseFloat(value);
    return parsed.toString() === value ? parsed > 0 : value === 'true';
}
