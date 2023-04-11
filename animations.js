import * as THREE from 'three';

// Create an array of times for the keyframes (in seconds)
var times = [0, 0.2, 1];

// Create an array of values for the position.y track (in meters)
var positionValues = [ 0, 0, -5, 0, 0.75, -5, 0, 0, -5 ];

// Create an array of values for the scale.x track (no unit)
var scaleValues = [ 1, 1, 1, 2, 2, 2, 1, 1, 1 ];


// Create a position.y track with linear interpolation
var positionTrack = new THREE.KeyframeTrack('.position', times ,positionValues ,THREE.InterpolateSmooth);

// Create a scale.x track with smooth interpolation
//var scaleTrack = new THREE.KeyframeTrack('.scale', times ,scaleValues ,THREE.InterpolateSmooth);


// Create an animation clip with all the tracks and a name and duration
var clip1 = new THREE.AnimationClip('Jump', -1 ,[positionTrack ]); //,scaleTrack

// POSITION - attribute, timings, positions (x, y, z)
//var positionKF = new THREE.VectorKeyframeTrack( '.position', [ 0, 0.5, 2 ], [ 0, 20, -150, 0, 40, -150, 0, 20, -150 ] );

// SCALE
//var scaleKF = new THREE.VectorKeyframeTrack( '.scale', [ 0, 1, 2 ], [ 1, 1, 1, 2, 2, 2, 1, 1, 1 ] );

// ROTATION
// Rotation should be performed using quaternions, using a QuaternionKeyframeTrack
// Interpolating Euler angles (.rotation property) can be problematic and is currently not supported

// set up rotation about x axis
//var xAxis = new THREE.Vector3( 1, 0, 0 );
//var qInitial = new THREE.Quaternion().setFromAxisAngle( xAxis, 0 );
//var qFinal = new THREE.Quaternion().setFromAxisAngle( xAxis, Math.PI );
//var quaternionKF = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 1, 2 ], [ qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w, qInitial.x, qInitial.y, qInitial.z, qInitial.w ] );

//Satellite animation
// Create an array of times for the keyframes (in seconds)
var times2 = [0, 15];

// Create an array of values for the position.y track (in meters)
var positionValues2 = [ -30, -100, -100, 150, 150, -40 ];

// Create a position.x track with linear interpolation
var positionTrack2 = new THREE.KeyframeTrack('.position', times2 ,positionValues2 ,THREE.InterpolateSmooth);

// set up rotation about x axis
var xAxis = new THREE.Vector3( 0.5, 0, 0 );
var qInitial = new THREE.Quaternion().setFromAxisAngle( xAxis, 0 );
var qFinal = new THREE.Quaternion().setFromAxisAngle( xAxis, Math.PI );
var quaternionKF2 = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 10, 15 ], [ qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w, qInitial.x, qInitial.y, qInitial.z, qInitial.w ] );

// Create an animation clip with all the tracks and a name and duration
export const satelliteAnimation = new THREE.AnimationClip('satellite', -1 ,[positionTrack2, quaternionKF2]); //,scaleTrack

// SCALE
//var scaleKF = new THREE.VectorKeyframeTrack( '.scale', [ 0, 1, 2 ], [ 1, 1, 1, 2, 2, 2, 1, 1, 1 ] );

// ROTATION
// Rotation should be performed using quaternions, using a QuaternionKeyframeTrack
// Interpolating Euler angles (.rotation property) can be problematic and is currently not supported


// COLOR
//var colorKF = new THREE.ColorKeyframeTrack( '.material.color', [ 0, 1, 2 ], [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ], THREE.InterpolateDiscrete );

// OPACITY
//var opacityKF = new THREE.NumberKeyframeTrack( '.material.opacity', [ 0, 1, 2 ], [ 1, 0, 1 ] );

// create an animation sequence with the tracks
// If a negative time value is passed, the duration will be calculated from the times of the passed tracks array
//var clip1 = new THREE.AnimationClip( 'Action', 3, [  positionKF ] ); //add required KFs: quaternionKF, colorKF, opacityKF, scaleKF,


// POSITION - attribute, timings, positions (x, y, z)
//var positionKF = new THREE.VectorKeyframeTrack( '.position', [ 0, 0.5, 2 ], [ 0, 20, -150, 0, 40, -150, 0, 20, -150 ] );

// SCALE
//var scaleKF = new THREE.VectorKeyframeTrack( '.scale', [ 0, 1, 2 ], [ 1, 1, 1, 2, 2, 2, 1, 1, 1 ] );

// ROTATION
// Rotation should be performed using quaternions, using a QuaternionKeyframeTrack
// Interpolating Euler angles (.rotation property) can be problematic and is currently not supported

// set up rotation about x axis
var times3 = [0];
var yAxis = new THREE.Vector3( 0, 1, 0 );
var qInitial2 = new THREE.Quaternion().setFromAxisAngle( yAxis, 0 );
var qFinal2 = new THREE.Quaternion().setFromAxisAngle( yAxis, Math.PI);
var qFinal3 = new THREE.Quaternion().setFromAxisAngle( yAxis, Math.PI*2);
var positionValues3 = [ -18.5, 0.5, -72];
var positionTrack3 = new THREE.KeyframeTrack('.position', times3, positionValues3 ,THREE.InterpolateSmooth);
var quaternionKF3 = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 2, 4 ], [  qInitial2.x, qInitial2.y, qInitial2.z, qInitial2.w, qFinal2.x, qFinal2.y, qFinal2.z, qFinal2.w, qFinal3.x, qFinal3.y, qFinal3.z, qFinal3.w ] );

export const radarAnimation = new THREE.AnimationClip('radar', -1 ,[positionTrack3, quaternionKF3], THREE.NormalBlending); //,scaleTrack




