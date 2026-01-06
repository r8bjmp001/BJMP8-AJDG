import React from 'react';

export enum PersonnelType {
  REGIONAL = 'REGIONAL',
  UNIT = 'UNIT'
}

export interface BasePersonnelData {
  photo: string | null; // Base64
  rankName: string;
  designation: string;
  jobFunctions: string;
}

export interface RegionalData extends BasePersonnelData {
  office: string;
  bjmpLogo: string | null;
  regionalLogo: string | null;
  govLogo: string | null;
}

export interface UnitData extends BasePersonnelData {
  unitLogo: string | null; // Base64
  bjmpLogo: string | null;
  govLogo: string | null;
  jailUnit: string;
  address: string;
}

export type FormData = RegionalData | UnitData;

export interface TabProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}