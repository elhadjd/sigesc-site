<?php

namespace App\Services\Tax;

/**
 * Decimal money helpers (bcmath) — avoids float rounding errors in tax math.
 */
final class Money
{
    public const SCALE = 4;

    public static function of(int|float|string $value): string
    {
        if (is_string($value)) {
            $value = str_replace([' ', ','], ['', '.'], $value);
        }

        return bcadd((string) $value, '0', self::SCALE);
    }

    public static function add(string $a, string $b): string
    {
        return bcadd($a, $b, self::SCALE);
    }

    public static function sub(string $a, string $b): string
    {
        return bcsub($a, $b, self::SCALE);
    }

    public static function mul(string $a, string $b): string
    {
        return bcmul($a, $b, self::SCALE);
    }

    public static function div(string $a, string $b): string
    {
        if (bccomp($b, '0', self::SCALE) === 0) {
            throw new \InvalidArgumentException('Division by zero.');
        }

        return bcdiv($a, $b, self::SCALE);
    }

    public static function comp(string $a, string $b): int
    {
        return bccomp($a, $b, self::SCALE);
    }

    public static function max(string $a, string $b): string
    {
        return self::comp($a, $b) >= 0 ? $a : $b;
    }

    public static function roundKz(string $value): string
    {
        // Monetary display in Kz with 2 decimal places (banker's-safe half-up via bcmul trick).
        $scaled = bcmul($value, '100', self::SCALE);
        $parts = explode('.', $scaled.'.0');
        $int = $parts[0];
        $frac = substr(($parts[1] ?? '0').'0', 0, 1);

        if ((int) $frac >= 5) {
            $int = bcadd($int, '1', 0);
        }

        return bcdiv($int, '100', 2);
    }

    public static function formatKz(string $value): string
    {
        $rounded = self::roundKz($value);
        $negative = self::comp($rounded, '0') < 0;
        $abs = $negative ? self::mul($rounded, '-1') : $rounded;
        [$whole, $decimals] = array_pad(explode('.', $abs), 2, '00');
        $whole = preg_replace('/\B(?=(\d{3})+(?!\d))/', '.', $whole) ?? $whole;

        return ($negative ? '-' : '').$whole.','.str_pad(substr($decimals, 0, 2), 2, '0').' Kz';
    }
}
