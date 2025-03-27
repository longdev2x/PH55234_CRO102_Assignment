import { View, ViewProps } from 'react-native';
import { COLORS } from '@/constants/theme';

interface ThemedViewProps extends ViewProps {
    variant?: 'primary' | 'secondary' | 'background';
}

export function ThemedView({
    variant = 'background',
    style,
    ...props
}: ThemedViewProps) {
    const getBackgroundColor = () => {
        switch (variant) {
            case 'primary':
                return COLORS.primary;
            case 'secondary':
                return COLORS.secondary;
            case 'background':
                return COLORS.background;
            default:
                return COLORS.background;
        }
    };

    return (
        <View
            style={[
                {
                    backgroundColor: getBackgroundColor(),
                },
                style,
            ]}
            {...props}
        />
    );
} 