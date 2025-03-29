import React from 'react';
import { Tabs } from 'expo-router';
import { View, Image } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#000000',
                tabBarInactiveTintColor: '#898989',
                tabBarStyle: {
                    height: 50,
                    borderTopWidth: 0.5,
                    borderTopColor: '#EEEEEE',
                    elevation: 0,
                    shadowOpacity: 0,
                    marginBottom: 30,
                    backgroundColor: 'transparent',
                },
                tabBarShowLabel: false,
                headerShown: false,
                tabBarItemStyle: {
                    paddingVertical: 10,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                source={require('@/assets/images/ic_bottom_home.png')}
                                style={{
                                    width: 24,
                                    height: 24
                                }}
                            />
                            {focused && (
                                <View
                                    style={{
                                        width: 4,
                                        height: 4,
                                        borderRadius: 2,
                                        backgroundColor: '#000000',
                                        marginTop: 4,
                                    }}
                                />
                            )}
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                source={require('@/assets/images/ic_bottom_search.png')}
                                style={{
                                    width: 24,
                                    height: 24
                                }}
                            />
                            {focused && (
                                <View
                                    style={{
                                        width: 4,
                                        height: 4,
                                        borderRadius: 2,
                                        backgroundColor: '#000000',
                                        marginTop: 4,
                                    }}
                                />
                            )}
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                source={require('@/assets/images/ic_bottom_notification.png')}
                                style={{
                                    width: 24,
                                    height: 24
                                }}
                            />
                            {focused && (
                                <View
                                    style={{
                                        width: 4,
                                        height: 4,
                                        borderRadius: 2,
                                        backgroundColor: '#000000',
                                        marginTop: 4,
                                    }}
                                />
                            )}
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                source={require('@/assets/images/ic_bottom_profile.png')}
                                style={{
                                    width: 24,
                                    height: 24
                                }}
                            />
                            {focused && (
                                <View
                                    style={{
                                        width: 4,
                                        height: 4,
                                        borderRadius: 2,
                                        backgroundColor: '#000000',
                                        marginTop: 4,
                                    }}
                                />
                            )}
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
} 