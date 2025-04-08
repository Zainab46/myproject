import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, Dimensions, PanResponder, Switch, Button, TouchableOpacity } from 'react-native';
import Svg, { Path, Line, Text as SvgText, Circle } from 'react-native-svg';
import * as math from 'mathjs';

const GraphCalculator = ({navigation, route}) => {
  const { graphvalue } = route.params;
  const [equation, setEquation] = useState('');
  const [error, setError] = useState('');
  const [points, setPoints] = useState([]);
  
  // Graph view dimensions
  const WIDTH = Dimensions.get('window').width - 20;
  const HEIGHT = 300;
  const PADDING = 40;
  
  // Graph settings
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);
  const [showPoints, setShowPoints] = useState(false);
  const [showValues, setShowValues] = useState(false);
  
  // Default view bounds to reset to
  const defaultBounds = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };
  
  // Set up pan responder
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const dx = (gestureState.dx / (WIDTH - 2 * PADDING)) * (xMax - xMin);
      const dy = (gestureState.dy / (HEIGHT - 2 * PADDING)) * (yMax - yMin);
      
      setXMin(xMin - dx);
      setXMax(xMax - dx);
      setYMin(yMin + dy);
      setYMax(yMax + dy);
    }
  });
  
  const mapX = (x) => PADDING + ((x - xMin) / (xMax - xMin)) * (WIDTH - 2 * PADDING);
  const mapY = (y) => HEIGHT - PADDING - ((y - yMin) / (yMax - yMin)) * (HEIGHT - 2 * PADDING);
  
  // Reset view to defaults
  const resetView = () => {
    setXMin(defaultBounds.xMin);
    setXMax(defaultBounds.xMax);
    setYMin(defaultBounds.yMin);
    setYMax(defaultBounds.yMax);
  };
  
  // Calculate graph points
  useEffect(() => {
    setEquation(graphvalue);
    if (!equation) return;
    
    try {
      const expr = math.compile(equation);
      const newPoints = [];
      
      // Calculate points for graph - reduce the number of points by increasing the step size
      const step = (xMax - xMin) / 20;  // Increase the step to reduce the number of points displayed
      for (let x = xMin; x <= xMax; x += step) {
        try {
          const y = expr.evaluate({ x });
          if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
            if (y >= yMin && y <= yMax) {
              newPoints.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
            }
          }
        } catch (e) {}
      }
      
      setPoints(newPoints);
      setError('');
    } catch (e) {
      setError('Invalid equation');
      setPoints([]);
    }
  }, [equation, xMin, xMax, yMin, yMax]);

  // Create SVG path data
  const createPath = () => {
    if (points.length === 0) return '';
    
    let path = `M ${mapX(points[0].x)} ${mapY(points[0].y)}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${mapX(points[i].x)} ${mapY(points[i].y)}`;
    }
    return path;
  };

  // Create data points with values
  const renderDataPoints = () => {
    if (!showPoints || points.length === 0) return null;
    
    // Display fewer points - reduce the number of points displayed by skipping some points
    return points
      .filter((_, index) => index % 2 === 0)  // Show every second point
      .map((point, index) => (
        <React.Fragment key={`point-${index}`}>
          <Circle
            cx={mapX(point.x)}
            cy={mapY(point.y)}
            r={1.5}
            fill="white"
            stroke="black"
            strokeWidth={1}
          />
          {showValues && (
            <SvgText
              x={mapX(point.x) + 8}
              y={mapY(point.y) - 8}
              fontSize="10"
              fill="white"
              fontWeight="bold"
              textAnchor="start"
            >
              ({point.x}, {point.y})
            </SvgText>
          )}
        </React.Fragment>
      ));
  };
  
  const createXTicks = () => {
    const ticks = [];
    const step = Math.ceil((xMax - xMin) / 10);
    for (let x = Math.ceil(xMin / step) * step; x <= xMax; x += step) {
      const xPos = mapX(x);
      ticks.push(
        <React.Fragment key={`x-${x}`}>
          <Line
            x1={xPos}
            y1={PADDING}
            x2={xPos}
            y2={HEIGHT - PADDING}
            stroke="white"
            strokeWidth="0.5"
          />
          <Line
            x1={xPos}
            y1={HEIGHT - PADDING + 5}
            x2={xPos}
            y2={HEIGHT - PADDING - 5}
            stroke="white"
            strokeWidth="1"
          />
          <SvgText
            x={xPos}
            y={HEIGHT - PADDING + 20}
            textAnchor="middle"
            fontSize="12"
            fill="white"
          >
            {x}
          </SvgText>
        </React.Fragment>
      );
    }
    return ticks;
  };

  const createYTicks = () => {
    const ticks = [];
    const step = Math.ceil((yMax - yMin) / 10);
    for (let y = Math.ceil(yMin / step) * step; y <= yMax; y += step) {
      const yPos = mapY(y);
      ticks.push(
        <React.Fragment key={`y-${y}`}>
          <Line
            x1={PADDING}
            y1={yPos}
            x2={WIDTH - PADDING}
            y2={yPos}
            stroke="white"
            strokeWidth="0.5"
          />
          <Line
            x1={PADDING - 5}
            y1={yPos}
            x2={PADDING + 5}
            y2={yPos}
            stroke="white"
            strokeWidth="1"
          />
          <SvgText
            x={PADDING - 10}
            y={yPos + 4}
            textAnchor="end"
            fontSize="12"
            fill="white"
          >
            {y}
          </SvgText>
        </React.Fragment>
      );
    }
    return ticks;
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <View style={styles.controlsContainer}>
        <View style={styles.controlItem}>
          <Text style={{color: 'white'}}>Show Points</Text>
          <Switch 
            value={showPoints} 
            onValueChange={setShowPoints} 
          />
        </View>
        <View style={styles.controlItem}>
          <Text style={{color: 'white'}}>Show Values</Text>
          <Switch 
            value={showValues} 
            onValueChange={setShowValues}
            disabled={!showPoints}
          />
        </View>
      </View>

      <View style={{height:100,alignItems:'center',flexDirection:'row-reverse'}}>
        <TouchableOpacity style={{width:100,height:30,backgroundColor:'white',alignItems:'center',borderRadius:10}}><Text style={{fontWeight:'bold',marginTop:5}}>Table</Text></TouchableOpacity></View>
      
      <View style={styles.graphContainer} {...panResponder.panHandlers}>
        <Svg width={WIDTH} height={HEIGHT} style={styles.graph}>
          <Line
            x1={PADDING}
            y1={mapY(0)}
            x2={WIDTH - PADDING}
            y2={mapY(0)}
            stroke="white"
            strokeWidth="1"
          />
          <Line
            x1={mapX(0)}
            y1={PADDING}
            x2={mapX(0)}
            y2={HEIGHT - PADDING}
            stroke="white"
            strokeWidth="1"
          />
          {createXTicks()}
          {createYTicks()}
          <Path
            d={createPath()}
            stroke="#bdb4ff"
            strokeWidth="2"
            fill="none"
          />
          {renderDataPoints()}
        </Svg>
      </View>
      
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>• Pan to move the graph</Text>
        <Text style={styles.instructionText}>• Point values show when zoomed in</Text>
        <Text style={styles.instructionText}>• Type expressions like: x^2, sin(x), sqrt(x)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#222',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  controlItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '40%',
  },
  graphContainer: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    backgroundColor: '#222',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  instructions: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 8,
  },
  instructionText: {
    fontSize: 14,
    marginBottom: 5,
    color: 'white',
  },
});

export default GraphCalculator;
