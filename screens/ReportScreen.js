import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { fetchUsers, fetchTasks } from '../util/firebase';

const screenWidth = Dimensions.get('window').width;

export default function ReportScreen() {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const usersData = await fetchUsers();
                const tasksData = await fetchTasks();

                setUsers(Array.isArray(usersData) ? usersData : []);
                setTasks(Array.isArray(tasksData) ? tasksData : []);
            } catch (error) {
                console.error('Error loading data:', error.message);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);


    const userTaskCounts = users.reduce((acc, user) => {
        const userFullName = `${user.Name} ${user.LastName}`;
        acc[userFullName] = 0;
        return acc;
    }, {});


    tasks.forEach(task => {
        if (task && task.assignedTo) {
            const assignedUser = users.find(user => user.id === task.assignedTo);
            if (assignedUser) {
                const userFullName = `${assignedUser.Name} ${assignedUser.LastName}`;
                userTaskCounts[userFullName] = (userTaskCounts[userFullName] || 0) + 1;
            }
        }
    });


    const getInitials = (user) => {
        const firstInitial = user.Name.charAt(0).toUpperCase();
        const lastInitial = user.LastName.charAt(0).toUpperCase();
        return `${firstInitial}${lastInitial}`;
    };

    const userChartLabels = users.map(user => getInitials(user));
    const userChartData = users.map(user => userTaskCounts[`${user.Name} ${user.LastName}`]);


    const taskStatuses = tasks.reduce((acc, task) => {
        if (task && task.status) {
            acc[task.status] = (acc[task.status] || 0) + 1;
        }
        return acc;
    }, {});

    const taskChartLabels = Object.keys(taskStatuses);
    const taskChartData = Object.values(taskStatuses);
    const taskChartColors = ['blue', 'green', 'orange', 'red'];

    const totalTasks = taskChartData.reduce((sum, count) => sum + count, 0);

    const chartConfig = {
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        fillShadowGradient: '#0080ff',
        fillShadowGradientOpacity: 1,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        barPercentage: 0.4,
        propsForBackgroundLines: {
            strokeWidth: 0,
        },
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading Reports...</Text>
            </View>
        );
    }

    if (userChartData.every(count => count === 0)) {
        return (
            <View style={styles.loadingContainer}>
                <Text>No users assigned to any tasks.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>User Report</Text>
            <ScrollView contentContainerStyle={styles.ScrollchartContainer} horizontal={true}>
                <BarChart
                    data={{
                        labels: userChartLabels,
                        datasets: [
                            {
                                data: userChartData,
                            },
                        ],
                    }}
                    width={screenWidth}
                    height={220}
                    chartConfig={chartConfig}
                    verticalLabelRotation={0}
                />
            </ScrollView>

            <Text style={styles.header}>Task Report</Text>
            <View style={styles.chartContainer}>
                <View style={styles.pieChartContainer}>
                    <PieChart
                        data={taskChartLabels.map((label, index) => ({
                            name: label,
                            population: taskChartData[index],
                            color: taskChartColors[index % taskChartColors.length],
                            legendFontColor: '#7F7F7F',
                            legendFontSize: 15,
                        }))}
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={chartConfig}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        hasLegend={false}
                    />
                </View>
            </View>

            <View style={styles.legendContainer}>
                {taskChartLabels.map((label, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View style={[styles.legendColorBox, { backgroundColor: taskChartColors[index % taskChartColors.length] }]} />
                        <Text style={styles.legendText}>
                            {label}: {taskChartData[index]} ({((taskChartData[index] / totalTasks) * 100).toFixed(2)}%)
                        </Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    ScrollchartContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 15,
    },
    chartContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    pieChartContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginLeft: 150,
    },
    legendContainer: {
        marginTop: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        justifyContent: 'center',
    },
    legendColorBox: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    legendText: {
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
