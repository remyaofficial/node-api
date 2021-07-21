import { Injectable } from '@nestjs/common';
import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin';
import { Job } from '../../../utils/job';

@Injectable()
export class FireAuthService {
  constructor(private firebaseAuth: FirebaseAuthenticationService) {}

  /**
   * listUsers from Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async listUsers(job: Job) {
    try {
      const limit = job.payload.limit || null;
      const page = job.payload.page || null;
      const userRecords = await this.firebaseAuth.listUsers(limit, page);
      return { data: userRecords };
    } catch (error) {
      return { error };
    }
  }

  /**
   * getUser from Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async getUser(job: Job) {
    try {
      const uid = job.payload.uid;
      const userRecord = await this.firebaseAuth.getUser(uid);
      return { data: userRecord };
    } catch (error) {
      return { error };
    }
  }

  /**
   * getUserByEmail from Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async getUserByEmail(job: Job) {
    try {
      const email = job.payload.email;
      const userRecord = await this.firebaseAuth.getUserByEmail(email);
      return { data: userRecord };
    } catch (error) {
      return { error };
    }
  }

  /**
   * getUserByPhoneNumber from Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async getUserByPhoneNumber(job: Job) {
    try {
      const phone = job.payload.phone;
      const userRecord = await this.firebaseAuth.getUserByPhoneNumber(phone);
      return { data: userRecord };
    } catch (error) {
      return { error };
    }
  }

  /**
   * createUser in Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async createUser(job: Job) {
    try {
      const body = job.payload.body;
      const claims = job.payload.claims || null;
      const userRecord = await this.firebaseAuth.createUser(body);
      if (!!claims) {
        await this.firebaseAuth.setCustomUserClaims(userRecord.uid, claims);
      }
      return { data: userRecord };
    } catch (error) {
      return { error };
    }
  }

  /**
   * updateUser in Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async updateUser(job: Job) {
    try {
      const uid = job.payload.uid;
      const body = job.payload.body;
      const claims = job.payload.claims || null;
      const userRecord = await this.firebaseAuth.updateUser(uid, body);
      if (!!claims) {
        await this.firebaseAuth.setCustomUserClaims(userRecord.uid, claims);
      }
      return { data: userRecord };
    } catch (error) {
      return { error };
    }
  }

  /**
   * deleteUser in Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information to delete Entity
   * @return {object} { error, data }
   */
  async deleteUser(job: Job) {
    try {
      const uid = job.payload.uid;
      const response = await this.firebaseAuth.deleteUser(uid);
      return { data: response };
    } catch (error) {
      return { error };
    }
  }

  /**
   * deleteUsers in Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information to delete Entity
   * @return {object} { error, data }
   */
  async deleteUsers(job: Job) {
    try {
      const uids = job.payload.uids;
      const deleteUsersResult = await this.firebaseAuth.deleteUsers(uids);
      return { data: deleteUsersResult };
    } catch (error) {
      return { error };
    }
  }

  /**
   * createCustomToken from Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async createCustomToken(job: Job) {
    try {
      const uid = job.payload.uid;
      const additionalClaims = job.payload.additionalClaims || null;
      const customToken = await this.firebaseAuth.createCustomToken(
        uid,
        additionalClaims,
      );
      return { data: customToken };
    } catch (error) {
      return { error };
    }
  }

  /**
   * verifyIdToken from Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async verifyIdToken(job: Job) {
    try {
      const idToken = job.payload.idToken;
      const checkRevoked = job.payload.checkRevoked || false;
      const decodedToken = await this.firebaseAuth.verifyIdToken(
        idToken,
        checkRevoked,
      );
      return { data: decodedToken };
    } catch (error) {
      return { error };
    }
  }

  /**
   * revokeRefreshTokens from Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async revokeRefreshTokens(job: Job) {
    try {
      const uid = job.payload.uid;
      const response = await this.firebaseAuth.revokeRefreshTokens(uid);
      return { data: response };
    } catch (error) {
      return { error };
    }
  }

  /**
   * generateEmailVerificationLink from Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async generateEmailVerificationLink(job: Job) {
    try {
      const url = job.payload.url;
      const email = job.payload.email;
      const actionCodeSettings = {
        url,
      };
      const link = await this.firebaseAuth.generateEmailVerificationLink(
        email,
        actionCodeSettings,
      );
      return { data: link };
    } catch (error) {
      return { error };
    }
  }

  /**
   * generatePasswordResetLink from Firebase
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async generatePasswordResetLink(job: Job) {
    try {
      const url = job.payload.url;
      const email = job.payload.email;
      const actionCodeSettings = {
        url,
      };
      const link = await this.firebaseAuth.generatePasswordResetLink(
        email,
        actionCodeSettings,
      );
      return { data: link };
    } catch (error) {
      return { error };
    }
  }
}
