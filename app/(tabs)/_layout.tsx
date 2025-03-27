import React from 'react';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { View } from 'react-native';

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
                    tabBarIcon: ({ focused, color }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Feather name="home" size={24} color={color} />
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
                    tabBarIcon: ({ focused, color }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Feather name="search" size={24} color={color} />
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
                    tabBarIcon: ({ focused, color }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Feather name="bell-off" size={24} color={color} />
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
                    tabBarIcon: ({ focused, color }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Feather name="user" size={24} color={color} />
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