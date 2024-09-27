import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { fetchTasksWithUserDetails2 } from "../util/firebase";
import { Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchTasks } from "../util/firebase";

function ReportUserScreen() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [taskChartData, setTaskChartData] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await AsyncStorage.getItem('userId');
                setUserId(id);
            } catch (error) {
                console.error('Error fetching userId:', error);
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        const getUserTasks = async () => {
            if (!userId) return;

            try {
                const allTasks = await fetchTasks();
                const userTasks = allTasks.filter(task => task.assignedTo === userId);
                setTasks(userTasks);
                processTaskData(userTasks);
            } catch (error) {
                console.error('Error fetching user tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        getUserTasks();
    }, [userId]);

    const processTaskData = (tasks) => {
        const statusCount = {};
        tasks.forEach(task => {
            const status = task.status || 'Unknown';
            statusCount[status] = (statusCount[status] || 0) + 1;
        });

        const data = Object.entries(statusCount).map(([label, count], index) => ({
            name: label,
            population: count,
            color: chartColors[index % chartColors.length], // Assign a color from the predefined array
        }));

        setTaskChartData(data);
    };

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
        return <Text style={styles.loadingText}>Loading...</Text>;
    }

    if (taskChartData.length === 0) {
        return <Text style={styles.loadingText}>No tasks available.</Text>;
    }

    const screenWidth = Dimensions.get('window').width;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Task Report</Text>
            <PieChart
                style={styles.chart}
                data={taskChartData}
                width={screenWidth - 40} // Ensures some margin from screen edges
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                hasLegend={false}
            />
            {taskChartData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendColorBox, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>
                        {item.name}: {item.population} ({((item.population / tasks.length) * 100).toFixed(2)}%)
                    </Text>
                </View>
            ))}
        </ScrollView>
    );
}

export default ReportUserScreen;

const styles = StyleSheet.create({
    chart: {
        marginVertical: 30,
        alignSelf: 'center',  // Ensure the chart is centered horizontally
        marginLeft: 140
    },
    container: {
        flexGrow: 1,          // Ensures that content grows to fit the space
        justifyContent: 'center',  // Centers content vertically
        alignItems: 'center',      // Centers content horizontally
        padding: 20,
        backgroundColor: '#fff',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    legendColorBox: {
        width: 20,
        height: 20,
        marginRight: 8,
    },
    legendText: {
        fontSize: 16,
    },
    loadingText: {
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 16,
    },
});

const chartColors = ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF'];
