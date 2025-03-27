import { Text, TextProps } from 'react-native';
import { COLORS, SIZES } from '@/constants/theme';

interface ThemedTextProps extends TextProps {
    variant?: 'h1' | 'h2' | 'h3' | 'body1' | 'body2' | 'caption';
    color?: string;
}

export function ThemedText({
    variant = 'body1',
    color = COLORS.text,
    style,
    ...props
}: ThemedTextProps) {
    const getFontSize = () => {
        switch (variant) {
            case 'h1':
                return SIZES.h1;
            case 'h2':
                return SIZES.h2;
            case 'h3':
                return SIZES.h3;
            case 'body1':
                return SIZES.body1;
            case 'body2':
                return SIZES.body2;
            case 'caption':
                return SIZES.caption;
            default:
                return SIZES.body1;
        }
    };

    return (
        <Text
            style={[
                {
                    fontSize: getFontSize(),
                    color,
                    fontFamily: 'System',
                },
                style,
            ]}
            {...props}
        />
    );
} 