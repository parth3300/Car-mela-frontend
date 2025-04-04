import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../Constants/constant";
import { motion } from "framer-motion";
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import StarRating from "../../components/common/StarRating";
import SkeletonLoader from "../../components/common/SkeletonLoader";
// ... existing code ... 